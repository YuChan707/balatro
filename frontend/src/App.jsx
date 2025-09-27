import "./App.css";
import Menu from "./components/menu";
import testData from "./data/test.json";
import Game from "./components/game";

function App() {
  return (
    <>
      <Game cards={testData} />
      <Menu />
    </>
  );
}

export default App;
