import "./App.css";
import Game from "./components/game";
import Gameplay from "./components/Gameplay";
import Menu from "./components/menu";
import testData from "./data/test.json";

function App() {
  return (
    <>
      <Game cards={testData} />
    </>
  );
}

export default App;
