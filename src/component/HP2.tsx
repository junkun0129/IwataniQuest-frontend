import * as React from "react";
import { Component, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  animate,
  useAnimationControls,
} from "framer-motion";
import {
  atackEnemy1,
  atackEnemy2,
  atackEnemy3,
} from "../store/features/enemySlice";
import { useNonInitialEffect } from "../customhooks/useNonInitialEffect";
import { useAppDispatch, useAppSelector } from "../store/store";
type Props = {
  sceneState: number;
  dialog: string;
  shapeState: number;
  chosenNum: number | null;
  setSceneState: (state: number) => void;
  setChosenNum: (num: number | null) => void;
};
const swordStyle = {
  height: "200%",
};
const ballStyle = {
  height: "80%",
  width: "20%",
  borderRadius: "500px",
};
const defaultStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "10px",
};
const atackEnemies = [atackEnemy1, atackEnemy2, atackEnemy3];
const HP2 = React.forwardRef(
  (
    {
      sceneState,
      dialog,
      shapeState,
      chosenNum,
      setSceneState,
      setChosenNum,
    }: Props,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const dispatch = useAppDispatch();

    const hp = useAppSelector(
      (state) => state.reducer.userStatusReducer.status.hp
    );
    const mxHp = useAppSelector(
      (state) => state.reducer.userStatusReducer.status.maxmumHp
    );
    const boxControll = useAnimationControls();

    useNonInitialEffect(() => {
      boxControll.start({
        background: `linear-gradient(to left, black ${
          (1 - hp / mxHp) * 100
        }%, lime ${(1 - hp / mxHp) * 100}% ${(hp / mxHp) * 100}%)`,
      });
    }, [hp]);
    useNonInitialEffect(() => {
      if (sceneState === 2) {
        boxControll.start(ballStyle);
      } else {
        boxControll.start(defaultStyle);
      }
    }, [sceneState]);

    useNonInitialEffect(() => {
      if (shapeState === 1) {
        boxControll.start(swordStyle);
      } else {
        boxControll.start(ballStyle);
      }
    }, [shapeState]);

    useNonInitialEffect(() => {
      if (chosenNum !== null) {
        boxControll
          .start({
            x: 100,
            y: 50,
            width: 50,
            height: 250,
            rotate: 100,
            transition: {
              duration: 1,
            },
          })
          .then((data) => {
            dispatch(atackEnemies[chosenNum]({ atack: 20 }));
          })
          .then((data) => {
            boxControll.start({
              rotate: 0,
              x: 0,
              y: 0,
              width: "100%",
              height: "100%",
              borderRadius: "10px",
            });
          })
          .then((data) => {
            setChosenNum(null);
            setSceneState(4);
          });
      }
    }, [chosenNum]);
    return (
      <>
        <motion.div
          ref={ref}
          animate={boxControll}
          style={{
            position: "relative",
            width: "100%",
            height: "240px",
            border: "10px solid white",
            borderRadius: "20px",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: `linear-gradient(to left, black ${
              (1 - hp / mxHp) * 100
            }%, lime ${(1 - hp / mxHp) * 100}% ${(hp / mxHp) * 100}%)`,
          }}
        >
          {dialog}
        </motion.div>
      </>
    );
  }
);
export default motion(HP2);
