import { useDispatch, useSelector } from "react-redux";
import GridSquare from "./GridSquare";
import { useEffect } from "react";
import {
  changeBallPosition,
  updateDisplayGrid,
  changeBallDirection,
  changePreviousBallPosition,
  setYsquareTo0,
} from "../redux/bouncingBallSlice";

function Grid(props) {
  const dispatch = useDispatch();
  let board = useSelector((state) => state.bouncingBall.displayGrid);
  let ballPosition = useSelector((state) => state.bouncingBall.ballPosition);
  let ballDirection = useSelector((state) => state.bouncingBall.ballDirection);
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

  const findBallPosition = (inputBoard) => {
    for (let i = 0; i < inputBoard.length; i++) {
      const ballY = inputBoard[i].indexOf("1");
      if (ballY !== -1) {
        dispatch(changeBallPosition({ row: i, col: ballY }));
        break;
      }
    }
  };

  const setBallDirection = (inputBallPosition, inputBoard) => {
    const directions = ["DR", "UL", "DL", "UR"];
    const availableDirections = [];
    for (let i = 0; i < 4; i++) {
      if (canBallMoveForward(inputBoard, inputBallPosition, directions[i])) {
        availableDirections.push(directions[i]);
        console.log(`inside iteration`);
        console.log(`available directions`, availableDirections);
      }
    }
    console.log(`after iteration`);
    const randomDirectionIndex = Math.floor(
      Math.random() * availableDirections.length
    );
    console.log("randomDirectionIndex", randomDirectionIndex);
    console.log(
      "ball direction move",
      availableDirections[randomDirectionIndex]
    );
    dispatch(changeBallDirection(availableDirections[randomDirectionIndex]));
  };

  const canBallMoveForward = (inputBoard, inputBallPosition, direction) => {
    const nextGridSquareValue = getNextGridSquare(
      inputBoard,
      inputBallPosition,
      direction
    );
    const nextGridSquarePosition = getNextGridSquare(
      inputBoard,
      inputBallPosition,
      direction,
      true
    );
    console.log(`nextgridsquare pos: ${nextGridSquarePosition}`);
    console.log(`nextgridsquare val: ${nextGridSquareValue}`);
    console.log(
      `params: ${direction},${inputBallPosition.row}, ${inputBoard} `
    );
    switch (nextGridSquareValue) {
      case "X":
        return false;
      case "Y":
        dispatch(setYsquareTo0(nextGridSquarePosition));
        return false;
      default:
        return nextGridSquarePosition;
    }
  };

  const linearMoveDRULPosition = (row) => {
    return { row: row, col: row };
  };

  const linearMoveDLURPosition = (row) => {
    console.log(`row inside DLUR, ${row}`);
    return { row: row, col: 2 - row };
  };

  const getNextGridSquare = (
    inputBoard,
    inputBallPosition,
    direction,
    flag
  ) => {
    let nextPosition;

    switch (direction) {
      case "DR":
        nextPosition = linearMoveDRULPosition(inputBallPosition.row + 1);
        if (flag) {
          return { nextPosition };
        }
        return inputBoard[nextPosition.row][nextPosition.col];
      case "UL":
        nextPosition = linearMoveDRULPosition(inputBallPosition.row - 1);
        if (flag) {
          return { nextPosition };
        }
        return inputBoard[nextPosition.row][nextPosition.col];
      case "DL":
        nextPosition = linearMoveDLURPosition(inputBallPosition.row + 1);
        if (flag) {
          return { nextPosition };
        }
        return inputBoard[nextPosition.row][nextPosition.col];
      case "UR":
        nextPosition = linearMoveDLURPosition(inputBallPosition.row - 1);
        if (flag) {
          return { nextPosition };
        }
        return inputBoard[nextPosition.row][nextPosition.col];
      default:
        null;
    }
  };

  const startGame = () => {
    const inputBallPosition = { row: ballPosition.row, col: ballPosition.col };
    const [inputBoard, direction] = [board, ballDirection];
    // console.log(
    //   `Ball position ${inputBallPosition}, board: ${inputBoard}, direction ${direction}`
    // );
    setBallDirection(inputBallPosition, inputBoard);

    moveTheBall(direction, inputBoard, inputBallPosition);
  };

  const moveTheBall = (direction, inputBoard, inputBallPosition) => {
    let nextPosition = canBallMoveForward(
      inputBoard,
      inputBallPosition,
      direction
    );
    console.log(nextPosition);
    if (nextPosition) {
      dispatch(changePreviousBallPosition(ballPosition));
      dispatch(changeBallPosition(nextPosition));
      dispatch(updateDisplayGrid());
    } else {
      setBallDirection(inputBallPosition, inputBoard);
      moveTheBall(direction);
    }
  };
  useEffect(() => {
    findBallPosition(board);
  }, []);
  return (
    <div className="grid-board">
      {grid} <button onClick={() => startGame()}>TEST</button>
    </div>
  );
}

export default Grid;
