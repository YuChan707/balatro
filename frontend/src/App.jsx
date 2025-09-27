import "./App.css";
import Menu from "./components/menu";
import testData from "./data/test.json";
import Button from "./components/button";
import Game from "./components/game";

function App() {
  return (
    <>
      <Game cards={testData} />

      <Button text={""} />
    </>
  );
}

export default App;
