import os, uuid, json, re, traceback
from pathlib import Path
from typing import Any
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("Missing GOOGLE_API_KEY or GEMINI_API_KEY in .env")

client = genai.Client(api_key=API_KEY)

app = FastAPI(debug=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads"); UPLOAD_DIR.mkdir(exist_ok=True)

def _safe(filename: str) -> str:
    return f"{uuid.uuid4().hex}{Path(filename or 'file').suffix}"

def _json_only(text: str) -> Any:
    text = (text or "").strip()
    try:
        return json.loads(text)
    except Exception:
        m = re.search(r"(\{.*\}|\[.*\])", text, flags=re.DOTALL)
        if m:
            return json.loads(m.group(1))
        raise

@app.get("/ping")
def ping(): return {"ok": True}

@app.post("/upload")
async def quiz_from_file(
    file: UploadFile = File(...),
    num_questions: int = Form(5),
    difficulty: str = Form("mixed"),
    include_answers: bool = Form(True),
):
    # 1) save local copy
    saved = UPLOAD_DIR / _safe(file.filename)
    try:
        with saved.open("wb") as f:
            while chunk := await file.read(1024 * 1024):
                f.write(chunk)
    finally:
        await file.close()

    # 2) upload to Gemini Files API
    try:
        uploaded = client.files.upload(file=str(saved))
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=502, detail=f"Gemini Files upload failed: {e}")

    # 3) ask the model for JSON questions
    schema_hint = {
        "type":"array",
        "items":{
            "type":"object",
            "required":["id","type","question","choices"],
            "properties":{
                "id":{"type":"string"},
                "type":{"type":"string","enum":["mcq","true_false","short_answer"]},
                "question":{"type":"string"},
                "choices":{"type":"array","items":{"type":"string"}},
                "answer":{"type":["string","integer","boolean","null"]},
                "explanation":{"type":"string"}
            }
        }
    }

    system = ("You are a quiz generator. Use ONLY the provided file's content. "
              "Return STRICT JSON (no prose). If insufficient content, return [].")
    prompt = f"""
Create {num_questions} {difficulty} quiz questions based strictly on the file.
Prefer MCQs (3–5 choices). {"Include answers & short explanations." if include_answers else "Do not include answers."}
Return ONLY valid JSON that matches this schema:

{json.dumps(schema_hint, indent=2)}
"""

    try:
        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[system, prompt, uploaded],
        )
        raw = getattr(resp, "text", "") or ""
        data = _json_only(raw)
    except Exception as e:
        # log full traceback so you see it in the PowerShell window
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Gemini generate/parse failed: {e}")

    if not isinstance(data, list): data = []
    for i, q in enumerate(data):
        if isinstance(q, dict):
            q.setdefault("id", str(i+1))
            q.setdefault("choices", [])

    return {
        "ok": True,
        "original_filename": file.filename,
        "stored_path": str(saved),
        "gemini_file_uri": getattr(uploaded, "uri", None),
        "questions": data,
    }
