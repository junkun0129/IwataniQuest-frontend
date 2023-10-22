import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type eventsSliceType = {
  isEvent: boolean;
  dialog: string[];
};
const eventInitialState: eventsSliceType = {
  isEvent: false,
  dialog: [""],
};
export const eventsSlice = createSlice({
  name: "events",
  initialState: eventInitialState,
  reducers: {
    talkEventStarts: (state, action: PayloadAction<string[]>) => {
      (state.isEvent = true), (state.dialog = action.payload);
    },
    talkEventEnds: (state, action: PayloadAction) => {
      (state.isEvent = true), (state.dialog = [""]);
    },
  },
});

export const EventsReducer = eventsSlice.reducer;
export const { talkEventEnds, talkEventStarts } = eventsSlice.actions;
