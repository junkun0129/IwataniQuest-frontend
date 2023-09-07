import * as React from "react";
import { Component, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  atackEnemy1,
  atackEnemy2,
  atackEnemy3,
  maketozero1,
  maketozero2,
  maketozero3,
} from "../store/features/enemySlice";
import {
  getAttackFromEnemy,
  restoreHP,
} from "../store/features/userStatuSlice";
import { changeCollisionNum } from "../store/features/battleStateSlice";
import { motion } from "framer-motion";
function BattleDebag() {
  const dispatch = useAppDispatch();
  const enemy1Selector = useAppSelector((state) => state.enemy1Reducer);
  const enemy2Selector = useAppSelector((state) => state.enemy2Reducer);
  const enemy3Selector = useAppSelector((state) => state.enemy3Reducer);
  const enemySelectors = [enemy1Selector, enemy2Selector, enemy3Selector];

  const atackEnemies = [atackEnemy1, atackEnemy2, atackEnemy3];
  const zeroEnemies = [maketozero1, maketozero2, maketozero3];
  const playerStatus = useAppSelector(
    (state) => state.userStatusReducer.status
  );
  const collisionNum = useAppSelector(
    (state) => state.collisionNumReducer.collisionNum
  );

  const hpHeal = () => {
    dispatch(restoreHP({ hp: playerStatus.maxmumHp }));
  };

  const attackYou = () => {
    dispatch(getAttackFromEnemy({ attack: 4 }));
  };
  const attackenemy = () => {
    atackEnemies.forEach((action, i) => {
      dispatch(atackEnemies[i]({ atack: 4 }));
    });
  };
  useEffect(() => {
    console.log(collisionNum, "colisionnum");
  }, []);

  return (
    <>
      <motion.div
        drag
        style={{
          width: "700px",
          height: "200px",
          position: "relative",
          marginTop: "-500px",
          border: "solid black 2px",
        }}
      >
        <button onClick={hpHeal}>hp heal</button>
        <button onClick={attackYou}>hp reduce</button>
        <button onClick={attackenemy}>attack enemy</button>
        <h3>collisionNum :{collisionNum} </h3>
        <h3>your HP:{playerStatus.hp}</h3>
        <div style={{ display: "flex" }}>
          {enemySelectors.map((enemy, i) => {
            return (
              <div>
                <div> {enemy.name}</div>
                <div>HP: {enemy.hp}</div>
                <div>HP: {enemy.MaxHp}</div>
                <div>HP: {(enemy.hp / enemy.MaxHp) * 100}</div>
              </div>
            );
          })}
        </div>

        {zeroEnemies.map((zeroEnemy, i) => {
          return (
            <div>
              <button onClick={(e) => dispatch(zeroEnemy())}>
                make zero {enemySelectors[i].name}
              </button>
            </div>
          );
        })}
      </motion.div>
    </>
  );
}

export default BattleDebag;
