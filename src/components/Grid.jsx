import { useDispatch, useSelector } from "react-redux";
import GridSquare from "./GridSquare";
import { useEffect } from "react";
import { changeBallPosition } from "../redux/bouncingBallSlice";

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
        return;
      }
    }
  };

  const setBallDirection = (inputBallPosition) => {
    const availableDirections = [];
    const DR = board[inputBallPosition.row + 1][inputBallPosition.col + 1];
    const DL = board[inputBallPosition.row + 1][inputBallPosition.col - 1];
    const UR = board[inputBallPosition.row - 1][inputBallPosition.col + 1];
    const UL = board[inputBallPosition.row - 1][inputBallPosition.col - 1];
    
  };
  useEffect(() => {
    findBallPosition(board);
  }, []);

  return <div className="grid-board">{grid}</div>;
}

export default Grid;
