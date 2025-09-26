import React from "react";
import backCard from "./../assets/cardBack.png";

function Card({ side }) {
  if (side === "back") {
    return (
      <div
        className="w-[136px] h-[200px]"
        style={{
          backgroundImage: url(backCard),
        }}
      >
        lol
      </div>
    );
  }

  return (
    <div>
      <p className="font-bold text-2xl">Card</p>
    </div>
  );
}

export default Card;
