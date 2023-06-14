import { useSelector } from "react-redux";
import "./App.css";
import Grid from "./components/Grid";

function App() {
  let currentBallPosition = useSelector(
    (state) => state.bouncingBall.ballPosition
  );

  const moveTheball = () => {};
  return (
    <div className="App">
      <Grid />
    </div>
  );
}

export default App;
