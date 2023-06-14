import { createSlice } from "@reduxjs/toolkit";
import board from "../ExamInput";

export const bouncingBallSlice = createSlice({
  name: "bouncingBall",
  initialState: {
    inputGrid: board,
    displayGrid: board,
    ballPosition: { row: board.length - 1, col: 0 },
    ballDirection: null,
  },
  reducers: {
    changeBallPosition: (state, value) => {
      state.ballPosition = value.payload;
    },
    setBallDirection: (state, value) => {
      state.ballDirection = value.payload;
    },
    setDisplayGrid: (state, value) => {
      state.displayGrid = value.payload;
    },
  },
});

export const { changeBallPosition, setBallDirection, setDisplayGrid } =
  bouncingBallSlice.actions;

export default bouncingBallSlice.reducer;
