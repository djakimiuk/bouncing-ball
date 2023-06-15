import { createSlice } from "@reduxjs/toolkit";
import board from "../ExamInput";

export const bouncingBallSlice = createSlice({
  name: "bouncingBall",
  initialState: {
    inputGrid: board,
    displayGrid: board,
    ballPosition: { row: 7, col: 5 },
    previousBallPosition: { row: 7, col: 5 },
    ballDirection: null,
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
    updateDisplayGrid: (state) => {
      let gridCopy = [...state.displayGrid];
      gridCopy[state.previousBallPosition.row][
        state.previousBallPosition.col
      ] = 0;
      gridCopy[state.ballPosition.row][state.ballPosition.col] = 1;
      state.displayGrid = gridCopy;
    },
    setYsquareTo0: (state, value) => {
      let gridCopy = [...state.displayGrid];
      gridCopy[value.payload.row][value.payload.col] = 0;
      state.displayGrid = gridCopy;
    },
  },
});

export const {
  changeBallPosition,
  changeBallDirection,
  updateDisplayGrid,
  changePreviousBallPosition,
  setYsquareTo0,
} = bouncingBallSlice.actions;

export default bouncingBallSlice.reducer;
