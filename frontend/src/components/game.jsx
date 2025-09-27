import React, { useEffect, useState } from "react";

import bg from "./../assets/bg.png";
import Card from "./Card";
import { shuffle } from "./../utils/index";

const MAX_HAND = 3;

function Game({ cards }) {
  const [drawPile, setDrawPile] = useState([]);
  const [hand, setHand] = useState([]);
  const [discardPile, setDiscardPile] = useState({});
  const [turn, setTurn] = useState("player");
  const [round, setRound] = useState(1);

  const draw = () => {
    if (drawPile) {
      return;
    }

    if (hand.length >= MAX_HAND) {
      return;
    }

    const card = drawPile[0];
    setDrawPile((prev) => prev.slice(1));
    setHand((prev) => [...prev, card]);
  };

  useEffect(() => {
    const shuffled = shuffle(cards);

    const startingHand = shuffled.slice(0, 3);
    const remainingDeck = shuffled.slice(3);

    setHand(startingHand);
    setDrawPile(remainingDeck);
  }, []);

  return (
    <div
      className="h-screen w-screen bg-center bg-no-repeat bg-cover flex flex-col"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div>BOSS</div>

      <div className="flex flex-col self-center">
        <div className="flex">
          <div>Draw</div>

          <div className="flex gap-6">
            {hand.map((card, index) => (
              <Card key={index} cardDetail={card} />
            ))}
          </div>

          <div>Discad</div>
        </div>
        <div>HP</div>
      </div>
    </div>
  );
}

export default Game;
