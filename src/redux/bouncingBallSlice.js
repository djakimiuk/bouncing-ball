import { createSlice } from "@reduxjs/toolkit";
import board from "../ExamInput";

export const bouncingBallSlice = createSlice({
  name: "bouncingBall",
  initialState: {
    inputGrid: board,
    displayGrid: board,
    ballPosition: null,
    previousBallPosition: null,
    ballDirection: null,
    previousBallDirection: null,
    positionOfY: null,
  },
  reducers: {
    changeBallPosition: (state, value) => {
      state.ballPosition = value.payload;
    },
    changePreviousBallPosition: (state, value) => {
      state.previousBallPosition = value.payload;
    },
    changeBallDirection: (state, value) => {
      state.ballDirection = value.payload;
    },
    changePreviousBallDirection: (state, value) => {
      state.previousBallDirection = value.payload;
    },
    updateDisplayGrid: (state) => {
      let gridCopy = [...state.displayGrid];
      gridCopy[state.previousBallPosition[0]][state.previousBallPosition[1]] =
        "0";
      gridCopy[state.ballPosition[0]][state.ballPosition[1]] = "1";
      state.displayGrid = gridCopy;
    },
    setPositionOfY: (state, value) => {
      state.positionOfY = value.payload;
    },
    setYsquare0: (state) => {
      let gridCopy = [...state.displayGrid];
      gridCopy[state.positionOfY[0]][state.positionOfY[1]] = "0";
      state.displayGrid = gridCopy;
    },
    findBallPosition: (state) => {
      for (let i = 0; i < state.displayGrid.length; i++) {
        const ballY = state.displayGrid[i].indexOf("1");
        if (ballY !== -1) {
          state.ballPosition = [i, ballY];
          break;
        }
      }
    },
  },
});

export const {
  changeBallPosition,
  changePreviousBallPosition,
  changeBallDirection,
  changePreviousBallDirection,
  updateDisplayGrid,
  setPositionOfY,
  setYsquare0,
  findBallPosition,
} = bouncingBallSlice.actions;

export default bouncingBallSlice.reducer;
