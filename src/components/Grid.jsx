import GridSquare from "./GridSquare";
import board from "../ExamInput";

function Grid(props) {
  const grid = [];
  for (let row = 0; row < board.length; row++) {
    grid.push([]);
    for (let col = 0; col < board[0].length; col++) {
      grid[row].push(
        <GridSquare key={`${col}${row}`} color={board[row][col]} />
      );
    }
  }
  return <div className="grid-board">{grid}</div>;
}

export default Grid;
