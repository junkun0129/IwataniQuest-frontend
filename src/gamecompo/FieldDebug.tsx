import * as React from "react";
import { Component } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { motion } from "framer-motion";
import { changeGameMode } from "../store/features/StatesSlice";
function FieldDebug() {
  const dispatch = useAppDispatch();
  const selector = useAppSelector((state) => state);
  const modes = ["walk", "battle", "menu", "event"];

  const handleOptionChange = (event) => {
    console.log(event.target.value, "kklklklkklklklklk");
    dispatch(changeGameMode(event.target.value));
  };
  return (
    <>
      <motion.div
        drag
        style={{ position: "absolute", border: "solid black 4px", zIndex: 3 }}
      >
        <div>gamemode: {selector.StatesReducer.gameMode}</div>
        <select
          value={selector.StatesReducer.gameMode}
          onChange={handleOptionChange}
        >
          {modes.map((mode, i) => (
            <option value={mode} key={i}>
              {mode}
            </option>
          ))}
        </select>
        <div>{selector.EventsReducer.dialog}</div>
        <div></div>
      </motion.div>
    </>
  );
}

export default FieldDebug;
