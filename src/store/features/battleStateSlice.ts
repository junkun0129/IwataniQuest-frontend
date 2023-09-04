import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type battleStateSliceType = {
  state: number;
};

const initialState: battleStateSliceType = { state: 0 };

export const battleStateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    changeState: (state, action: PayloadAction<{ state: number }>) => {
      state.state = action.payload.state;
    },
  },
});
export type collisionNumSliceType = {
  collisionNum: number | null;
};

const initialState2: collisionNumSliceType = { collisionNum: null };

export const collisionNumSlice = createSlice({
  name: "collisionNum",
  initialState: initialState2,
  reducers: {
    changeCollisionNum: (
      state,
      action: PayloadAction<{ collisionNum: number }>
    ) => {
      state.collisionNum = action.payload.collisionNum;
    },
  },
});

export const collisionNumReducer = collisionNumSlice.reducer;
export const { changeCollisionNum } = collisionNumSlice.actions;
export const battleStateReducer = battleStateSlice.reducer;
export const { changeState } = battleStateSlice.actions;
