import React, { useEffect, useState } from "react";

import bg from "./../assets/bg.png";
import Card from "./Card";
import { shuffle } from "./../utils/index";
import CardFlip from "./CardboardQuestion";
import homeIcon from "./../assets/homeIcon.svg";
import Button from "./button";

const MAX_HAND = 3;

function Game({ cards, setInGame }) {
  const [drawPile, setDrawPile] = useState([]);
  const [hand, setHand] = useState([]);
  const [discardPile, setDiscardPile] = useState(null);
  const [turn, setTurn] = useState("player");
  const [round, setRound] = useState(1);
  const [selectedCard, setSelectedCard] = useState({});

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

  const drawDiscard = () => {
    if (!discardPile) {
      return;
    }

    if (hand.length >= MAX_HAND) {
      return;
    }

    setHand((prev) => [...prev, discardPile]);
    setDiscardPile(null);
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
      {selectedCard.card_name ? (
        <div className="flex items-center justify-center h-full">
          <CardFlip
            data={selectedCard}
            onAnswer={() => {
              console.log("test");
            }}
            onNext={() => {}}
          />
        </div>
      ) : (
        <>
          <div>BOSS</div>

          <div className="flex flex-col self-center">
            <div className="flex gap-[128px]">
              <div className="flex flex-col gap-[31px]">
                {drawPile.length === 0 ? (
                  <div className="border-8 w-[156px] h-[200px]" />
                ) : (
                  <Card side="back" />
                )}
                <Button text={"DRAW"} onClick={() => draw()} />
              </div>

              <div className="flex gap-6">
                {hand.map((card, index) => (
                  <Card
                    key={index}
                    cardDetail={card}
                    onTap={() => setSelectedCard(card)}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-[31px]">
                {discardPile ? (
                  <Card side="back" />
                ) : (
                  <div className="border-8 w-[156px] h-[200px]" />
                )}
                <Button text={"Discad"} onClick={() => drawDiscard()} />
              </div>
            </div>
            <div>HP</div>
          </div>
        </>
      )}

      <button
        className="absolute top-[32px] left-[32px] cursor-pointer hover:opacity-80"
        onClick={() => setInGame(false)}
      >
        <img src={homeIcon} alt="homeIcon" />
      </button>
    </div>
  );
}

export default Game;
