import * as React from "react";
import { Component, useEffect, useState } from "react";
import { GamePanel } from "../fieldcompo/GamePanel";
import { useAppDispatch } from "../store/store";
import { changeEncountState } from "../store/features/StatesSlice";
export function useGamePanelListener(game: GamePanel) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    game?.onFromGamePanel("encountEnemies", (data) => {
      dispatch(changeEncountState(true));
    });
  }, [game]);
}
