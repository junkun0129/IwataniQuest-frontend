import * as React from "react";
import { Component, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  atackEnemy1,
  atackEnemy2,
  atackEnemy3,
} from "../store/features/enemySlice";
import {
  getAttackFromEnemy,
  restoreHP,
} from "../store/features/userStatuSlice";
import { changeCollisionNum } from "../store/features/battleStateSlice";
function BattleDebag() {
  const dispatch = useAppDispatch();
  const atackEnemies = [atackEnemy1, atackEnemy2, atackEnemy3];
  const playerStatus = useAppSelector(
    (state) => state.userStatusReducer.status
  );
  const collisionNum = useAppSelector(
    (state) => state.collisionNumReducer.collisionNum
  );
  const battlestats = useAppSelector((state) => state.battleStateReducer.state);
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
      <div
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
        <h1 style={{ backgroundColor: "white" }}>your HP:{playerStatus.hp}</h1>
        <h1>collisionNum :{collisionNum} </h1>
      </div>
    </>
  );
}

export default BattleDebag;
