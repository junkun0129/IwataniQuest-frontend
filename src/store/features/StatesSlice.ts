import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { battleResultType, gameModeType, sequenceType } from "../../types/type";

export type statesSliceType = {
  battleSequence: sequenceType;
  encountState: boolean;
  battleResult: battleResultType;
  gameMode: gameModeType;
};

const statesInitial: statesSliceType = {
  battleSequence: "field",
  encountState: false,
  battleResult: "off",
  gameMode: "walk",
};

export const StatesSlice = createSlice({
  name: "states",
  initialState: statesInitial,
  reducers: {
    changeBattleSequence: (state, action: PayloadAction<sequenceType>) => {
      state.battleSequence = action.payload;
    },
    changeEncountState: (state, action: PayloadAction<boolean>) => {
      state.encountState = action.payload;
    },
    changeBattleResult: (state, action: PayloadAction<battleResultType>) => {
      state.battleResult = action.payload;
    },
    changeGameMode: (state, action: PayloadAction<gameModeType>) => {
      state.gameMode = action.payload;
    },
  },
});

export const StatesReducer = StatesSlice.reducer;
export const {
  changeBattleSequence,
  changeEncountState,
  changeBattleResult,
  changeGameMode,
} = StatesSlice.actions;
