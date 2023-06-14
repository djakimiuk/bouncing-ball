import { useDispatch, useSelector } from "react-redux";
import GridSquare from "./GridSquare";
import { useEffect } from "react";
import { changeBallPosition, setDisplayGrid } from "../redux/bouncingBallSlice";

function Grid(props) {
  const dispatch = useDispatch();
  let board = useSelector((state) => state.bouncingBall.displayGrid);
  let ballPosition = useSelector((state) => state.bouncingBall.ballPosition);
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
    for (let i = 0; i < directions.length; i++) {
      if (getBoardValue(inputBoard, inputBallPosition, directions[i]) !== "X") {
        availableDirections.push(directions[i]);
      }
    }
    const randomDirectionIndex = Math.floor(
      Math.random() * (availableDirections.length + 1)
    );
    dispatch(setBallDirection(availableDirections[randomDirectionIndex]));
  };

  const linearMoveDRULPosition = (row) => {
    return { row: row, col: row };
  };

  const linearMoveDLURPosition = (row) => {
    return { row: row, col: -row + 2 };
  };

  const getBoardValue = (inputBoard, inputBallPosition, direction) => {
    let position;
    switch (direction) {
      case "DR":
        position = linearMoveDRULPosition(inputBallPosition.row + 1);
        console.log(position);
        return inputBoard[position.row][position.col];
      case "UL":
        position = linearMoveDRULPosition(inputBallPosition.row - 1);
        console.log(position);
        return inputBoard[position.row][position.col];
      case "DL":
        position = linearMoveDLURPosition(inputBallPosition.row + 1);
        console.log(position);
        return inputBoard[position.row][position.col];
      case "UR":
        position = linearMoveDLURPosition(inputBallPosition.row - 1);
        console.log(position);
        return inputBoard[position.row][position.col];
      default:
        null;
    }
  };

  const moveTheBall = () => {
    setBallDirection(ballPosition, board);
    const newPosition = linearMoveDLURPosition(2);
    const boardCopy = [...board];
    boardCopy[ballPosition.row][ballPosition.col] = 0;
    boardCopy[newPosition.row][newPosition.col] = 1;
    dispatch(setDisplayGrid(boardCopy));
  };

  useEffect(() => {
    findBallPosition(board);
  }, []);
  return <div className="grid-board">{grid}</div>;
}

export default Grid;
