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
  const [round, setRound] = useState(1);
  const [bossHP, setBossHP] = useState(15);
  const [userHP, setUserHP] = useState(15);
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardAnswered, setCardAnswered] = useState(false);
  const [rotateBoss, setRotateBoss] = useState(false);

  useEffect(() => {
    setRotateBoss(true);
    setTimeout(() => {
      setRotateBoss(false);
    }, 800);
  }, [bossHP]);

  const takeDmg = () => {
    const dmg = Math.floor(Math.random() * 4) + 1;
    console.log("Taking dmg: ", dmg);

    setUserHP((prev) => Math.max(prev - dmg, 0));

    if (userHP <= 0) {
      alert("You loose! :C");
      setInGame(false);
    }
  };

  const draw = () => {
    if (drawPile.length <= 0) {
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
    <div className="h-screen w-screen flex flex-col gap-[72px]">
      <img
        src={bg}
        alt="bg"
        className={`absolute -z-20 inset-0 w-full h-full object-cover ${selectedCard && "blur"}`}
      />

      {selectedCard ? (
        <div className="flex items-center justify-center h-full flex-col gap-[48px]">
          <CardFlip
            data={selectedCard}
            onAnswer={(isCorrect, dmg, choice) => {
              // mark as answered so parent shows Next
              setCardAnswered(true);
              // original onAnswer behavior
              console.log("answered", { isCorrect, dmg, choice });

              if (isCorrect) {
                setBossHP((prev) => Math.max(prev - dmg, 0));
                if (bossHP <= 0) {
                  alert("YOU WIN!!!");
                  setInGame(false);
                }
              } else {
                takeDmg();
                setDiscardPile(selectedCard);
              }

              setHand((prev) => prev.filter((c) => c != selectedCard));
              setSelectedCard(null);
              setRound((prev) => prev + 1);
            }}
            setIsCorrect={setIsCorrect}
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
              className={`h-[320px] w-auto object-contain ${rotateBoss && "rotate-y-180"}`}
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
