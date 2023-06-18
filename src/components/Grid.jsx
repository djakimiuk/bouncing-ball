import GridSquare from "./GridSquare";
import { useEffect, useState } from "react";
import board from "../ExamInput";

function Grid(props) {
  const [grid, setGrid] = useState(board);
  const [gridToDisplay, setGridToDisplay] = useState(board);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [ballPosition, setBallPosition] = useState([]);
  const [previousBallPosition, setPreviousBallPosition] = useState([]);
  const [ballDirection, setBallDirection] = useState(null);
  const [previousBallDirection, setPreviousBallDirection] = useState([]);
  const [positionOfYsquare, setPositionOfYsquare] = useState([]);

  const findBallPosition = () => {
    for (let i = 0; i < gridToDisplay.length; i++) {
      const ballY = gridToDisplay[i].indexOf("1");
      if (ballY !== -1) {
        console.log(`before setting ball position`);
        setPreviousBallPosition([i, ballY]);
        setBallPosition([i, ballY]);
        break;
      }
    }
  };

  const renderGrid = () => {
    const grid = [];
    console.log(gridToDisplay);
    for (let row = 0; row < gridToDisplay.length; row++) {
      grid.push([]);
      for (let col = 0; col < gridToDisplay[0].length; col++) {
        grid[row].push(
          <GridSquare
            key={`${col}${row}`}
            color={`${gridToDisplay[row][col]}`}
          />
        );
      }
    }
    return grid;
  };
  const getAvailableDirections = () => {
    const directions = ["DR", "UL", "DL", "UR"];
    const availableDirections = directions.filter(canBallMoveForward);
    console.log(`Inside function getAvailableDirections`);
    console.log(`Forbidden direction`, getForbiddenDirection());
    if (availableDirections.length > 1) {
      return availableDirections.filter(
        (direction) => direction !== getForbiddenDirection()
      );
    }
    return availableDirections;
  };

  const getForbiddenDirection = () => {
    let forbiddenDirection;
    switch (ballDirection) {
      case "DR":
        forbiddenDirection = "UL";
        break;
      case "UL":
        forbiddenDirection = "DR";
        break;
      case "UR":
        forbiddenDirection = "DL";
        break;
      case "DL":
        forbiddenDirection = "UR";
        break;
      default:
        forbiddenDirection = null;
    }
    return forbiddenDirection;
  };

  const defineBallDirection = () => {
    setPreviousBallDirection(ballDirection);
    const availableDirections = getAvailableDirections();
    console.log(`available directions`, availableDirections);
    const randomDirectionIndex = Math.floor(
      Math.random() * availableDirections.length
    );
    console.log("randomDirectionIndex", randomDirectionIndex);
    console.log(
      "ball direction move",
      availableDirections[randomDirectionIndex]
    );
    const direction = availableDirections[randomDirectionIndex];
    console.log(`direction before state change ${direction}`);
    setBallDirection(direction);
    console.log(`direction after state change ${ballDirection}`);
    return direction;
  };

  const canBallMoveForward = (direction) => {
    const nextGridSquare = getNextGridSquare(direction);
    console.log(
      "nextGridSquareValue can ball move forward",
      nextGridSquare.value
    );
    console.log(
      "nextGridSquarePosition can ball move forward",
      nextGridSquare.position
    );
    switch (nextGridSquare.value) {
      case "X":
        return false;
      case "Y":
        return false;
      case undefined:
        return false;
      case "0":
        return true;
      default:
        return false;
    }
  };

  const getNextGridSquare = (direction) => {
    let result = { position: null, value: null };
    console.log(`ballpositon:`, ballPosition);

    switch (direction) {
      case "DR":
        result.position = [ballPosition[0] + 1, ballPosition[1] + 1];
        break;
      case "UL":
        result.position = [ballPosition[0] - 1, ballPosition[1] - 1];
        break;
      case "DL":
        result.position = [ballPosition[0] + 1, ballPosition[1] - 1];
        break;
      case "UR":
        result.position = [ballPosition[0] - 1, ballPosition[1] + 1];
        break;
      default:
        result.position = null;
    }
    console.log(`result position`, result.position);
    if (result.position) {
      result.value = board[result.position[0]][result.position[1]];
    }
    return result;
  };

  const updateDisplayGrid = (previousPosition, newPosition) => {
    let gridCopy = [...gridToDisplay];
    console.log(`In updateDisplayGrid block ball position: ${newPosition}`);
    console.log(
      `In updateDisplayGrid block ball previous position: ${previousPosition}`
    );
    gridCopy[previousPosition[0]][previousPosition[1]] = "0";
    if (newPosition) {
      gridCopy[newPosition[0]][newPosition[1]] = "1";
    }
    setGridToDisplay(gridCopy);
  };

  const moveTheBall = (ballDirection) => {
    const nextGridSquare = getNextGridSquare(ballDirection);
    console.log("next position from moveTheBall:", nextGridSquare?.position);
    if (canBallMoveForward(ballDirection)) {
      setPreviousBallPosition(ballPosition);
      setBallPosition(nextGridSquare.position);
      updateDisplayGrid(ballPosition, nextGridSquare.position);
    } else {
      console.log(`BALL DIRECTION CHANGE!!`);
      const newDirection = defineBallDirection();
      console.log(newDirection);
      setBallDirection(newDirection);
      if (nextGridSquare.value === "Y") {
        updateDisplayGrid(nextGridSquare.position);
      }
    }
  };

  const startGame = () => {
    setIsGameStarted(true);
    console.log(`ball position after start`, ballPosition);
    const direction = ballDirection ? ballDirection : defineBallDirection();
    console.log(`DIRECTION!!!`, direction);
    moveTheBall(direction);
  };

  useEffect(() => {
    console.log(`Actual ball position ${ballPosition}`);
    console.log(`Previous ball position ${previousBallPosition}`);
  }, [ballPosition, previousBallPosition]);

  useEffect(() => {
    findBallPosition();
    console.log("ballPosition from code", ballPosition);
  }, []);

  useEffect(() => {
    if (isGameStarted) {
      const gameInterval = setInterval(() => {
        moveTheBall(ballDirection);
      }, 100);
      return () => {
        clearInterval(gameInterval);
      };
    }
  }, [isGameStarted, ballPosition, previousBallDirection, ballDirection]);
  return (
    <>
      <div className="grid-board">{renderGrid()}</div>
      <div>
        <button onClick={() => startGame()}>START</button>
        <button>STOP</button>
      </div>
    </>
  );
}

export default Grid;
