import React, { useEffect, useState } from "react";

import bg from "./../assets/bg.png";
import Card from "./Card";
import { shuffle } from "./../utils/index";
import CardFlip from "./CardboardQuestion";

const MAX_HAND = 3;

function Game({ cards }) {
  const [drawPile, setDrawPile] = useState([]);
  const [hand, setHand] = useState([]);
  const [discardPile, setDiscardPile] = useState({});
  const [turn, setTurn] = useState("player");
  const [round, setRound] = useState(1);
  const [selectedCard, setSelectedCard] = useState({});
  const [cardAnswered, setCardAnswered] = useState(false);

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
      {selectedCard.card_name ? (
        <div className="flex items-center justify-center h-full relative">
          {/* NEXT button placed at the top/start of the Game view */}
          {cardAnswered && (
            // center this container horizontally so it lines up with the internal Next button
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50" style={{ width: 270 }}>
              <button
                className="next"
                onClick={() => {
                  // advance / close the card
                  setCardAnswered(false);
                  // mirror the Card's internal next behavior: clear selectedCard
                  setSelectedCard({});
                }}
              >
                Next card
              </button>
            </div>
          )}

          <CardFlip
            data={selectedCard}
            onAnswer={(isCorrect, dmg, choice) => {
              // mark as answered so parent shows Next
              setCardAnswered(true);
              // original onAnswer behavior
              console.log("answered", { isCorrect, dmg, choice });
            }}
            onNext={() => {
              // If Card calls onNext (e.g. via its internal Next), handle advancing here too
              setCardAnswered(false);
              setSelectedCard({}); // hide the card / return to hand view
              // optionally move card to discard, etc.
            }}
            showInternalNext={false}
          />
        </div>
      ) : (
        <>
          <div>BOSS</div>

          <div className="flex flex-col self-center">
            <div className="flex">
              <div className="flex flex-col gap-[31px]"></div>

              <div className="flex gap-6">
                {hand.map((card, index) => (
                  <Card
                    key={index}
                    cardDetail={card}
                    onTap={() => setSelectedCard(card)}
                  />
                ))}
              </div>

              <div>Discad</div>
            </div>
            <div>HP</div>
          </div>
        </>
      )}
    </div>
  );
}

export default Game;
