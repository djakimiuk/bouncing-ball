import { createSlice } from "@reduxjs/toolkit";
import board from "../ExamInput";

export const bouncingBallSlice = createSlice({
  name: "bouncingBall",
  initialState: {
    inputGrid: board,
    displayGrid: board,
    ballPosition: { row: 0, col: 0 },
    ballDirection: null,
  },
  reducers: {
    changeBallPosition: (state, value) => {
      state.ballPosition = value.payload;
    },
    setBallDirection: (state, value) => {
      state.ballDirection = value.payload;
    },
  },
});

export const { changeBallPosition, setBallDirection } =
  bouncingBallSlice.actions;

export default bouncingBallSlice.reducer;
