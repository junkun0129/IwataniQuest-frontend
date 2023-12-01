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
  const [resetNum, setResetNum] = useState(1);
  const dispatch = useAppDispatch();
  useEffect(() => {
    game?.onFromGamePanel("encountEnemies", (data) => {
      dispatch(changeEncountState(true));
      dispatch(changeGameMode("battle"));
    });

    game?.onFromGamePanel("runIntoNPC", (data) => {
      dispatch(talkEventStarts(data.dialogs));
      dispatch(changeGameMode("event"));
      setResetNum((pre) => pre + 1);
    });

    game?.onFromGamePanel("openMenu", (data) => {
      console.log("open");
      dispatch(changeGameMode("menu"));
    });
  }, [game]);
}
