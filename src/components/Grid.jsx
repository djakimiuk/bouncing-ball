import { useDispatch, useSelector } from "react-redux";
import GridSquare from "./GridSquare";
import { useEffect } from "react";
import {
  changeBallPosition,
  setDisplayGrid,
  changeBallDirection,
  changePreviousBallPosition
} from "../redux/bouncingBallSlice";

function Grid(props) {
  const dispatch = useDispatch();
  let board = useSelector((state) => state.bouncingBall.displayGrid);
  let ballPosition = useSelector((state) => state.bouncingBall.ballPosition);
  console.log("ballPosition from code", ballPosition);
  const grid = [];
  for (let row = 0; row < board.length; row++) {
    grid.push([]);
    for (let col = 0; col < board[0].length; col++) {
      grid[row].push(
        <GridSquare key={`${col}${row}`} color={board[row][col]} />
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
      if (getBoardValue(inputBoard, inputBallPosition, directions[i]) !== "X") {
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
    let ballDirection = availableDirections[randomDirectionIndex];
    dispatch(changeBallDirection(ballDirection));
  };

  const linearMoveDRULPosition = (row) => {
    return { row: row, col: row };
  };

  const linearMoveDLURPosition = (row) => {
    console.log(`row inside DLUR, ${row}`);
    return { row: row, col: 2 - row };
  };

  const getBoardValue = (inputBoard, inputBallPosition, direction) => {
    let position;

    switch (direction) {
      case "DR":
        position = linearMoveDRULPosition(inputBallPosition.row + 1);
        console.log("getBoardValueDR", position);
        console.log("board value", position.row, position.col);
        return inputBoard[position.row][position.col];
      case "UL":
        position = linearMoveDRULPosition(inputBallPosition.row - 1);
        console.log("getBoardValueUL", position);
        return inputBoard[position.row][position.col];
      case "DL":
        position = linearMoveDLURPosition(inputBallPosition.row + 1);
        console.log("getBoardValueDL", position);
        return inputBoard[position.row][position.col];
      case "UR":
        position = linearMoveDLURPosition(inputBallPosition.row - 1);
        console.log("getBoardValueUR", position);
        return inputBoard[position.row][position.col];
      default:
        null;
    }
  };

  const moveTheBall = () => {
    setBallDirection(ballPosition, board);
    const newPosition = linearMoveDRULPosition(2);
    dispatch(changePreviousBallPosition(ballPosition))
    dispatch(changeBallPosition(newPosition));
    dispatch(setDisplayGrid());
  };

  useEffect(() => {
    findBallPosition(board);
  }, []);
  return (
    <div className="grid-board">
      {grid} <button onClick={() => moveTheBall()}>TEST</button>
    </div>
  );
}

export default Grid;
