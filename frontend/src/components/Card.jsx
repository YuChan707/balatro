import React from "react";
import backCard from "./../assets/cardBack.png";
import commonCard from "./../assets/commonCard.png";
import rareCard from "./../assets/rareCard.png";
import epicCard from "./../assets/epicCard.png";
import HP from "./../assets/hp.svg";

function Card({ side = "front", cardDetail, onTap }) {
  if (side === "back") {
    return (
      <img
        src={backCard}
        alt="card back"
        className="min-h-[200px] h-[200px] max-h-[200px]"
      />
    );
  }

  let background = commonCard;
  if (cardDetail.rarity === "Rare") {
    background = rareCard;
  } else if (cardDetail.rarity === "Epic") {
    background = epicCard;
  }

  return (
    <div
      className="bg-no-repeat bg-center bg-contain flex flex-col justify-between px-2 cursor-pointer hover:opacity-85 hover:rotate-3 drop-shadow-2xl pop-in"
      onClick={() => onTap()}
      style={{
        backgroundImage: `url(${background})`,
        width: 136.5,
        height: 200,
        border: cardDetail.isRetry ? "4px solid #FFC857" : "none",
      }}
    >
      <div
        className="flex text-stroke w-full justify-end"
        style={{
          color: "#FFC857",
          fontWeight: 700,
        }}
      >
        <span
          className="rotate-[-2.21deg]"
          style={{
            fontSize: 40,
          }}
        >
          {cardDetail.dmg}
        </span>
        <img src={HP} alt="hp" />
      </div>

      <span className="text-[#1E1E2F] name-stroke font-bold text-[24px] leading-[20px] rotate-[4.85deg] mb-9 break-words">
        {cardDetail.card_name}
      </span>
    </div>
  );
}

export default Card;
