import "./App.css";
import Card from "./components/Card";
import testData from "./data/test.json";

function App() {
  return (
    <>
      <Card cardDetail={testData[4]} isRetry={true} />
    </>
  );
}

export default App;
