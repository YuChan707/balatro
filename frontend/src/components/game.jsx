import React, { useEffect, useState } from "react";

import bg from "./../assets/bg.png";
import Card from "./Card";
import { shuffle } from "./../utils/index";
import CardFlip from "./CardboardQuestion";
import homeIcon from "./../assets/homeIcon.svg";
import Button from "./button";
import boss from "./../assets/first.png";
import HPBar from "./HPBar";

const MAX_HAND = 3;

function Game({ cards, setInGame }) {
  const [drawPile, setDrawPile] = useState([]);
  const [hand, setHand] = useState([]);
  const [discardPile, setDiscardPile] = useState(null);
  const [turn, setTurn] = useState("player");
  const [round, setRound] = useState(1);
  const [bossHP, setBossHP] = useState(15);
  const [userHP, setUserHP] = useState(15);
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardAnswered, setCardAnswered] = useState(false);

  const draw = () => {
    if (!drawPile) {
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
      className="h-screen w-screen bg-center bg-no-repeat bg-cover flex flex-col gap-[72px]"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {selectedCard?.card_name ? (
        <div className="flex items-center justify-center h-full flex-col gap-[48px]">
          <CardFlip
            data={selectedCard}
            onAnswer={(isCorrect, dmg, choice) => {
              // mark as answered so parent shows Next
              setCardAnswered(true);
              // original onAnswer behavior
              console.log("answered", { isCorrect, dmg, choice });

              if (isCorrect) {
                setBossHP((prev) => prev - dmg);
                if (bossHP <= 0) {
                  alert("YOU WIN!!!");
                }
              } else {
                setDiscardPile(selectedCard);
              }

              setHand((prev) => prev.filter((c) => c != selectedCard));
              setSelectedCard(null);
            }}
            onNext={() => {}}
            setIsCorrect={setIsCorrect}
            showInternalNext={false}
          />
          <Button onClick={() => setSelectedCard(null)} text={"Cancel"} />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center">
            <span className="font-bold text-black text-center text-[32px]">
              PROFESSOR QUIZ
            </span>
            <HPBar type="boss" bars={bossHP} />
            <img
              src={boss}
              alt="boss"
              className="h-[320px] w-auto object-contain"
            />
          </div>

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
                <Button text={"Discard"} onClick={() => drawDiscard()} />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-white text-center text-[32px]">
                YOUR HP
              </span>
              <HPBar type="player" bars={userHP} />
            </div>
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
