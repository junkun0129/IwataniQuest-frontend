import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { sequenceType } from "../../types/type";

type initialStateType = { battleSequence: sequenceType; encountState: boolean };

const initialState: initialStateType = {
  battleSequence: "field",
  encountState: false,
};

export const StatesSlice = createSlice({
  name: "states",
  initialState,
  reducers: {
    changeBattleSequence: (state, action: PayloadAction<sequenceType>) => {
      state.battleSequence = action.payload;
    },
    changeEncountState: (state, action: PayloadAction<boolean>) => {
      state.encountState = action.payload;
    },
  },
});

export const StatesReducer = StatesSlice.reducer;
export const { changeBattleSequence, changeEncountState } = StatesSlice.actions;
