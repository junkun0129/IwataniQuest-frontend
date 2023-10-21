import { useAppSelector } from "./store";

export const e = useAppSelector((state) => state.StatesReducer.battleSequence);

export const enemy1Selector = useAppSelector((state) => state.enemy1Reducer);
export const enemy2Selector = useAppSelector((state) => state.enemy2Reducer);
export const enemy3Selector = useAppSelector((state) => state.enemy3Reducer);

export const playerStatus = useAppSelector(
  (state) => state.userStatusReducer.status
);
