import { useDispatch, useSelector } from "react-redux";
import GridSquare from "./GridSquare";
import { useEffect } from "react";
import {
  changeBallPosition,
  changePreviousBallPosition,
  changeBallDirection,
  changePreviousBallDirection,
  updateDisplayGrid,
  setPositionOfY,
  setYsquare0,
} from "../redux/bouncingBallSlice";

function Grid(props) {
  const dispatch = useDispatch();
  let board = useSelector((state) => state.bouncingBall.displayGrid);
  let ballPosition = useSelector((state) => state.bouncingBall.ballPosition);
  let previousBallPosition = useSelector(
    (state) => state.bouncingBall.previousBallPosition
  );
  let ballDirection = useSelector((state) => state.bouncingBall.ballDirection);
  let previousBallDirection = useSelector(
    (state) => state.bouncingBall.previousBallDirection
  );
  let positionOfY = useSelector((state) => state.bouncingBall.positionOfY);

  console.log("ballPosition from code", ballPosition);

  const grid = [];
  for (let row = 0; row < board.length; row++) {
    grid.push([]);
    for (let col = 0; col < board[0].length; col++) {
      grid[row].push(
        <GridSquare key={`${col}${row}`} color={`${board[row][col]}`} />
      );
    }
  }

  const findBallPosition = () => {
    for (let i = 0; i < board.length; i++) {
      const ballY = board[i].indexOf("1");
      if (ballY !== -1) {
        dispatch(changeBallPosition({ row: i, col: ballY }));
        break;
      }
    }
  };

  const getAvailableDirections = () => {
    const directions = ["DR", "UL", "DL", "UR"];
    const availableDirections = [];

    for (let i = 0; i < 4; i++) {
      if (canBallMoveForward(directions[i])) {
        availableDirections.push(directions[i]);
        console.log(`available directions`, availableDirections);
      }
    }
    return availableDirections;
  };

  const getForbiddenDirection = () => {
    let forbiddenDirection;
    switch (previousBallDirection) {
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
        null;
    }
    return forbiddenDirection;
  };

  const setBallDirection = () => {
    dispatch(changePreviousBallDirection(ballDirection));
    let availableDirections = getAvailableDirections();
    let forbiddenDirection = getForbiddenDirection();

    if (availableDirections.length > 1) {
      availableDirections = availableDirections.filter(
        (direction) => direction !== forbiddenDirection
      );
    }

    const randomDirectionIndex = Math.floor(
      Math.random() * availableDirections.length
    );

    console.log("randomDirectionIndex", randomDirectionIndex);
    console.log(
      "ball direction move",
      availableDirections[randomDirectionIndex]
    );
    const direction = availableDirections[randomDirectionIndex];
    dispatch(changeBallDirection(direction));
    console.log(`direction after state change ${ballDirection}`);
  };

  const canBallMoveForward = (direction) => {
    const nextGridSquareValue = getNextGridSquare(direction);
    const nextGridSquarePosition = getNextGridSquare(direction, true);
    console.log(
      "nextGridSquareValue can ball move forward",
      nextGridSquareValue
    );
    console.log(
      "nextGridSquarePosition can ball move forward",
      nextGridSquarePosition
    );
    switch (nextGridSquareValue) {
      case "X":
        return false;
      case "Y":
        dispatch(
          setYsquareTo0({
            row: nextGridSquarePosition.row,
            col: nextGridSquarePosition.col,
          })
        );
        return false;
      default:
        return {
          row: nextGridSquarePosition.row,
          col: nextGridSquarePosition.col,
        };
    }
  };

  const getNextGridSquare = (direction) => {
    let result = { position: null, value: null };
    let currentPositionRow = ballPosition[0];
    let currentPositionCol = ballPosition[1];
    let nextPositionRow = result.position[0];
    let nextPositionCol = result.position[1];

    switch (direction) {
      case "DR":
        result.positon = [[currentPositionRow + 1, currentPositionCol + 1]];
        result.value = board[nextPositionRow][nextPositionCol];
        return result;
      case "UL":
        result.positon = [[currentPositionRow - 1, currentPositionCol - 1]];
        result.value = board[nextPositionRow][nextPositionCol];
        return result;
      case "DL":
        result.positon = [[currentPositionRow + 1, currentPositionCol - 1]];
        result.value = board[nextPositionRow][nextPositionCol];
        return result;
      case "UR":
        result.positon = [[currentPositionRow - 1, currentPositionCol + 1]];
        result.value = board[nextPositionRow][nextPositionCol];
        return result;
      default:
        null;
    }
  };

  const moveTheBall = (direction) => {
    let nextPosition = canBallMoveForward(direction);
    console.log("next position from moveTheBall:", nextPosition);
    if (nextPosition) {
      dispatch(changePreviousBallPosition(ballPosition));
      dispatch(changeBallPosition(nextPosition));
      dispatch(updateDisplayGrid());
    }
  };

  const startGame = () => {
    setBallDirection();
    moveTheBall(ballDirection);
  };

  useEffect(() => {
    findBallPosition();
  }, [dispatch]);
  return (
    <div className="grid-board">
      {grid} <button onClick={() => startGame()}>TEST</button>
    </div>
  );
}

export default Grid;
