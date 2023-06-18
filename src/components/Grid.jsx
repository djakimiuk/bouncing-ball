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
  findBallPosition,
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

  // const findBallPosition = () => {
  //   for (let i = 0; i < board.length; i++) {
  //     const ballY = board[i].indexOf("1");
  //     if (ballY !== -1) {
  //       dispatch(changeBallPosition([i, ballY]));
  //       break;
  //     }
  //   }
  // };

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

  const setBallDirection = () => {
    const availableDirections = getAvailableDirections();
    console.log(availableDirections);
    const randomDirectionIndex = Math.floor(
      Math.random() * availableDirections.length
    );
    console.log("randomDirectionIndex", randomDirectionIndex);
    console.log(availableDirections);
    console.log(
      "ball direction move",
      availableDirections[randomDirectionIndex]
    );
    const direction = availableDirections[randomDirectionIndex];
    console.log(`direction before state change ${direction}`);
    dispatch(changePreviousBallDirection(ballDirection));
    dispatch(changeBallDirection(direction));

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
        dispatch(setPositionOfY(nextGridSquare.position));
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

  const moveTheBall = (ballDirection) => {
    const nextGridSquare = getNextGridSquare(ballDirection);

    console.log("next position from moveTheBall:", nextGridSquare?.position);
    if (canBallMoveForward(ballDirection)) {
      dispatch(changePreviousBallPosition(ballPosition));
      dispatch(changeBallPosition(nextGridSquare.position));
      dispatch(updateDisplayGrid());
    } else {
      console.log(`BALL DIRECTION CHANGE!!`);
      const newDirection = setBallDirection();
      console.log(newDirection);
      moveTheBall(newDirection);
      dispatch(setYsquare0(nextGridSquare.position));
    }
  };

  const startGame = () => {
    const direction = ballDirection ? ballDirection : setBallDirection();
    moveTheBall(direction);
  };
  useEffect(() => {
    dispatch(findBallPosition());
  }, [dispatch]);
  return (
    <>
      <div className="grid-board">{grid}</div>
      <button onClick={() => startGame()}>START</button>
      <button>STOP</button>
    </>
  );
}

export default Grid;
