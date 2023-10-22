import * as React from "react";
import { Component, useEffect, useState } from "react";
import { GamePanel } from "../fieldcompo/GamePanel";
import { useAppDispatch } from "../store/store";
import {
  changeEncountState,
  changeGameMode,
} from "../store/features/StatesSlice";
import { talkEventStarts } from "../store/features/eventsSlice";
export function useGamePanelListener(game: GamePanel) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    game?.onFromGamePanel("encountEnemies", (data) => {
      dispatch(changeEncountState(true));
    });
    game?.onFromGamePanel("runIntoNPC", (data) => {
      console.log(data, "data from gamePanel");
      dispatch(changeGameMode("event"));
      dispatch(talkEventStarts(data.dialogs));
    });
    game?.onFromGamePanel("openMenu", (data) => {
      console.log("open");
      dispatch(changeGameMode("menu"));
    });
  }, [game]);
}
