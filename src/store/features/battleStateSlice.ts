import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//slice1
export type encountStateSliceType = {
  isEncount: boolean;
};

const initialState: encountStateSliceType = { isEncount: false };

export const encountStateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    changeState: (state, action: PayloadAction<{ isEncount: boolean }>) => {
      state.isEncount = action.payload.isEncount;
    },
  },
});

//slice2
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
export const encountStateReducer = encountStateSlice.reducer;
export const { changeState } = encountStateSlice.actions;
