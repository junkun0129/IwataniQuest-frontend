import React, { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useAppSelector } from "../store/store";
import useHPBarAnimation from "../customhooks/useHPBarAnimation";

type HPBarProps = {
  enemyRefs: React.RefObject<HTMLElement>[];
  dialog: string;
};

const HPBar = React.forwardRef(
  ({ enemyRefs, dialog }: HPBarProps, ref: React.Ref<HTMLDivElement>) => {
    const playerStatus = useAppSelector(
      (state) => state.userStatusReducer.status
    );

    const hpGage = useAnimationControls();
    useHPBarAnimation(hpGage, playerStatus.hp, playerStatus.maxmumHp);

    return (
      <motion.div
        ref={ref}
        style={{
          border: "white 8px solid",
          height: "30%",
          margin: 20,
          backgroundColor: "lightgray",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", fontSize: "3rem" }}>{dialog}</div>
        <motion.div
          animate={hpGage}
          style={{
            width: `${(playerStatus.hp / playerStatus.maxmumHp) * 100}%`,
            height: "100%",
            backgroundColor: "lightgreen",
          }}
        ></motion.div>
      </motion.div>
    );
  }
);

export default motion(HPBar);
