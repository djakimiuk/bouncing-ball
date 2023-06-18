import GridSquare from "./GridSquare";
import { useEffect, useState } from "react";
import board from "../ExamInput";

function Grid() {
  const [gridToDisplay, setGridToDisplay] = useState(board);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [ballPosition, setBallPosition] = useState([]);
  const [previousBallPosition, setPreviousBallPosition] = useState([]);
  const [ballDirection, setBallDirection] = useState(null);
  const [previousBallDirection, setPreviousBallDirection] = useState([]);

  const findBallPosition = () => {
    for (let i = 0; i < gridToDisplay.length; i++) {
      const ballY = gridToDisplay[i].indexOf("1");
      if (ballY !== -1) {
        setPreviousBallPosition([i, ballY]);
        setBallPosition([i, ballY]);
        break;
      }
    }
  };

  //checking wheter is possible to move forward: if yes then make a move and update the grid else change direction
  const moveTheBall = (ballDirection) => {
    const nextGridSquare = getNextGridSquare(ballDirection);
    if (canBallMoveForward(ballDirection)) {
      setPreviousBallPosition(ballPosition);
      setBallPosition(nextGridSquare.position);
      updateDisplayGrid(ballPosition, nextGridSquare.position);
    } else {
      const newDirection = defineBallDirection();
      setBallDirection(newDirection);
      if (nextGridSquare.value === "Y") {
        updateDisplayGrid(nextGridSquare.position);
      }
    }
  };

  //sets random move direction of the ball
  const defineBallDirection = () => {
    setPreviousBallDirection(ballDirection);
    const availableDirections = getAvailableDirections();
    const randomDirectionIndex = Math.floor(
      Math.random() * availableDirections.length
    );
    const direction = availableDirections[randomDirectionIndex];
    return direction;
  };

  //gets all posible directions on current ball position, if more than possible 1 then filters !== last direction
  const getAvailableDirections = () => {
    const directions = ["DR", "UL", "DL", "UR"];
    const availableDirections = directions.filter(canBallMoveForward);
    if (availableDirections.length > 1) {
      return availableDirections.filter(
        (direction) => direction !== getForbiddenDirection()
      );
    }
    return availableDirections;
  };

  //returns the previous direction to filter available directions
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

  //returns position of the next grid square
  const getNextGridSquare = (direction) => {
    let nextGrid = { position: null, value: null };

    switch (direction) {
      case "DR":
        nextGrid.position = [ballPosition[0] + 1, ballPosition[1] + 1];
        break;
      case "UL":
        nextGrid.position = [ballPosition[0] - 1, ballPosition[1] - 1];
        break;
      case "DL":
        nextGrid.position = [ballPosition[0] + 1, ballPosition[1] - 1];
        break;
      case "UR":
        nextGrid.position = [ballPosition[0] - 1, ballPosition[1] + 1];
        break;
      default:
        nextGrid.position = null;
    }

    if (nextGrid.position) {
      nextGrid.value = board[nextGrid.position[0]][nextGrid.position[1]];
    }
    return nextGrid;
  };

  //checks the value of the next grid square
  const canBallMoveForward = (direction) => {
    const nextGridSquare = getNextGridSquare(direction);
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

  //amend the grid squares values to new
  const updateDisplayGrid = (previousPosition, newPosition) => {
    let gridCopy = [...gridToDisplay];
    gridCopy[previousPosition[0]][previousPosition[1]] = "0";
    if (newPosition) {
      gridCopy[newPosition[0]][newPosition[1]] = "1";
    }
    setGridToDisplay(gridCopy);
  };

  //prepares the grid of GridSquare components with their values
  const renderGrid = () => {
    const grid = [];
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

  //on component mount sets initial ball position on the grid
  useEffect(() => {
    findBallPosition();
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
        <button onClick={() => setIsGameStarted(!isGameStarted)}>
          {isGameStarted ? "STOP" : "START"}
        </button>
      </div>
    </>
  );
}

export default Grid;
