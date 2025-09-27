import React, { useMemo, useState } from "react";
import "./format_Card.css";
import commonImg from "../assets/commonCard.png";
import rareImg from "../assets/rareCard.png";
import epicImg from "../assets/epicCard.png";

const RARITY_KEYS = {
  common: "common",
  uncommon: "uncommon",
  rare: "rare",
  epic: "epic",
  legendary: "legendary",
  exotic: "exotic",
  obsidian: "obsidian",
};

function normalizeRarity(r) {
  if (!r) return "common";
  const key = String(r)
    .replace(/[^a-z]/gi, "")
    .toLowerCase();
  return RARITY_KEYS[key] || "common";
}

function CardFlip({ data, onAnswer, onNext }) {
  const [choice, setChoice] = useState(null);
  const [exiting, setExiting] = useState(false);

  const rarityKey = normalizeRarity(data.rarity);
  const options = useMemo(() => {
    if (data.puzzle_type === "True_or_False") return ["True", "False"];
    return Array.isArray(data.options) && data.options.length > 0
      ? data.options
      : ["A", "B", "C", "D"];
  }, [data.puzzle_type, data.options]);

  const answered = choice !== null;
  const isCorrect = answered && choice === data.correct_answer;

  const handlePick = (opt) => {
    if (answered) return;
    setChoice(opt);
    onAnswer?.(opt === data.correct_answer, Number(data.dmg || 0), opt);
  };

  const rarityImages = {
    epic: epicImg,
    rare: rareImg,
    common: commonImg,
  };
  const imageSrc = rarityImages[rarityKey] || commonImg;

  return (
    <div
      className={`card card--${rarityKey} ${exiting ? "card--exit" : ""}`}
      aria-label={`${data.card_name} (${data.rarity})`}
      style={{ backgroundImage: `url(${imageSrc})` }}
    >
      <div className="card__overlay"></div>

      <div className="card__hp">
        {data.dmg}{" "}
        <span style={{ fontSize: 12, verticalAlign: "top" }}>HP</span>
      </div>

      <div className="card__content">
        <div className="card__question">{data.question}</div>

        <div className={`card__answers ${data.puzzle_type === "True_or_False" ? "card__answers--tf" : "card__answers--mc"}`}>
          {options.map((opt) => {
            const picked = choice === opt;
            const correct = opt === data.correct_answer;

            // base class
            // base class
            let cls = "btn";

            const isTF = data.puzzle_type === "True_or_False";

            if (isTF) {
              // For True/False, color True green and False red from the start
              cls += opt === "True" ? " btn--tf-true" : " btn--tf-false";
            } else {
              // For multiple-choice keep default white buttons; we'll apply result classes after answering
            }

            if (answered) {
              // after answering: mark correct/wrong
              if (correct) cls += " btn--correct"; // orange for MC, but TF overrides keep green/red
              else if (picked) cls += " btn--wrong"; // red for wrong
              else cls += " btn--neutral";
            }

            return (
              <button
                key={opt}
                disabled={answered}
                className={cls}
                onClick={() => handlePick(opt)}
              >
                {String(opt).toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="card__footer">
        <div className="card__name">{data.card_name}</div>
        <div className="card__rarity">{String(data.rarity)}</div>
      </div>

      {/* Result ribbon */}
      {answered && (
        <div
          className={`card__ribbon ${isCorrect ? "card__ribbon--ok" : "card__ribbon--nope"}`}
        >
          {isCorrect ? "Correct!" : "INCORRECT"}
        </div>
      )}
      {/* Check again button shown after answering */}
      {answered && (
        <div className="card__checkagain" style={{ zIndex: 40 }}>

        </div>
      )}
    </div>
  );
}
export default CardFlip;
