import * as React from "react";
import { Component } from "react";
import { useState, useEffect } from "react";
import Battle from "../gamecompo/Battle";
import Field, { socketType } from "../gamecompo/Field";
import { motion, useAnimationControls } from "framer-motion";
import styles from "./Game.module.scss";
import { useAppSelector } from "../store/store";
import Battle2 from "../gamecompo/Battle2";
import BattleDebag from "../gamecompo/BattleDebag";
import useScreenSwitch from "../customhooks/useScreenSwitch";

function Game({ socket }: socketType) {
  const { fieldControl, battleControl } = useScreenSwitch({ socket });

  return (
    <>
      <div className={styles.gameBox}>
        <motion.div
          animate={fieldControl}
          style={{ position: "absolute", width: "100vw", height: "100vh" }}
        >
          <Field socket={socket}></Field>
        </motion.div>

        <motion.div
          animate={battleControl}
          initial={{ x: -1600 }}
          style={{ position: "absolute", width: "100vw", height: "100vh" }}
        >
          {/* <Battle socket={socket}></Battle> */}
          <Battle2 socket={socket}></Battle2>
          <BattleDebag></BattleDebag>
        </motion.div>
      </div>
    </>
  );
}

export default Game;
