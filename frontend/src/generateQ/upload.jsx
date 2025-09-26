import { useRef, useState } from "react";
import "../index.css"; 

export default function UploadButton() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("Summarize or describe this file.");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState("");

  const pickFile = () => fileRef.current?.click();

  const onSelect = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setResult("");
  };

  const upload = async () => {
    if (!file) return;
    setStatus("Uploading...");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("prompt", prompt);

      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setResult(data?.gemini_text ?? "");
      setStatus("Done!");
    } catch (err) {
      console.error(err);
      setStatus("Error uploading file.");
    }
  };

  // Handler for the PLAY button: require a file, otherwise show user-friendly message
  const play = () => {
    if (!file) {
      setStatus("To PLAY need to select your material (boss)");
      return;
    }
    // if file exists, start upload flow
    upload();
  };

  return (
    <div className="upload-container">
      <h2>Balatest</h2>

      <input
        ref={fileRef}
        type="file"
        onChange={onSelect}
        style={{ display: "none" }}
      />

      <button className="choose-btn" onClick={pickFile}>
        Choose YOUR boss (topic) battler
      </button>
      <div>{file ? `Selected: ${file.name}` : "No file selected"}</div>

      <label>
        Prompt-test:
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
      </label>

      <button className="upload-btn" onClick={play}>
        PLAY
      </button>

      <div>{status}</div>
      {result && (
        <div className="result-box">
          <strong>BOSS question:</strong>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
