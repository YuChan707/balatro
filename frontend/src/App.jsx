import { useState } from "react";
import "./App.css";
import Game from "./components/game";
import Menu from "./components/menu";
import testData from "./data/test.json";

function App() {
  const [inGame, setInGame] = useState(false);
  const [cards, setCards] = useState([]);

  return (
    <>
      {!inGame ? (
        <Menu setInGame={setInGame} setCards={setCards} />
      ) : (
        <Game cards={cards} setInGame={setInGame} />
      )}
    </>
  );
}

export default App;
