import React, { useEffect, useRef, useState } from "react";
import { socketType } from "./Field";
import useEnemyData from "../customhooks/useEnemyData";
import Genkiman from "../enemycompo/Genkiman";
import Hentaiyou from "../enemycompo/Hentaiyou";
import Hukurou from "../enemycompo/Hukurou";
import { useAppDispatch, useAppSelector } from "../store/store";
import HPBar from "../component/HPBar";
import EnemyWrapper from "../utils/EnemyWrapper";
import { battleStateSliceType } from "../store/features/battleStateSlice";
import {
  atackEnemy1,
  atackEnemy2,
  atackEnemy3,
} from "../store/features/enemySlice";

const enemyArr = [<Genkiman />, <Hentaiyou />, <Hukurou />];

function Battle2({ socket }: socketType) {
  const enemyRefs = [useRef(null), useRef(null), useRef(null)];
  const { enemyComponents } = useEnemyData({ socket });
  const dispatch = useAppDispatch();
  const enemy1Selector = useAppSelector((state) => state.reducer.enemy1Reducer);
  const enemy2Selector = useAppSelector((state) => state.reducer.enemy2Reducer);
  const enemy3Selector = useAppSelector((state) => state.reducer.enemy3Reducer);
  const atackEnemies = [atackEnemy1, atackEnemy2, atackEnemy3];

  const enemySelectors = [enemy1Selector, enemy2Selector, enemy3Selector];
  const [enemyHP, setEnemyHP] = useState([
    enemy1Selector.hp,
    enemy2Selector.hp,
    enemy3Selector.hp,
  ]);
  const battleState = useAppSelector(
    (state) => state.reducer.battleStateReducer
  );
  // const attack = (i: number) => {
  //   dispatch(atackEnemies[i]({ atack: 2 }));
  //   console.log(";lkj");

  //   setEnemyHP([enemy1Selector.hp, enemy2Selector.hp, enemy3Selector.hp]);
  // };
  return (
    <>
      <h1>yattorukai</h1>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {enemyComponents.map((enemyCompo, i) => {
          return (
            <div
              ref={enemyRefs[i]}
              style={{ border: "black solid  2px", height: "250px" }}
            >
              <div>{enemySelectors[i].name}</div>
              <div
                style={{ width: "60%", height: "7%", backgroundColor: "gray" }}
              >
                <div
                  style={{
                    backgroundColor: "red",
                    height: "100%",
                    width: `${(enemyHP[i] / enemySelectors[i].MaxHp) * 100}%`,
                  }}
                ></div>
                {/* <button onClick={() => attack(i)}>attack</button> */}
              </div>
              {enemyCompo}
            </div>
          );
        })}
      </div>
      <HPBar enemyRefs={enemyRefs}></HPBar>
    </>
  );
}

export default Battle2;
