import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type battleStateSliceType = {
  state: number;
};

const initialState: battleStateSliceType = { state: 0 };
export const battleStateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    changeState: (state, action: PayloadAction<battleStateSliceType>) => {
      state.state = action.payload.state;
    },
  },
});
export const battleStateReducer = battleStateSlice.reducer;
export const { changeState } = battleStateSlice.actions;
