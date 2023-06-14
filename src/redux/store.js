import { configureStore } from "@reduxjs/toolkit";
import bouncingBallReducer from "./bouncingBallSlice";

export default configureStore({
  reducer: {
    bouncingBall: bouncingBallReducer,
  },
});
