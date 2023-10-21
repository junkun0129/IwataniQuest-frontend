import { useEffect, useState } from "react";
import { socketType } from "../gamecompo/Field";
import {
  createEnemy1,
  createEnemy2,
  createEnemy3,
  enemyDataStatusType,
  enemyStatusType,
} from "../store/features/enemySlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import reuseValue from "../reuseValue";
import Genkiman from "../enemycompo/Genkiman";
import Hentaiyou from "../enemycompo/Hentaiyou";
import Hukurou from "../enemycompo/Hukurou";
import { sequenceType } from "../types/type";
import { wait } from "../utils/wait";
import { enemiesData } from "../assets/enemiesData";
import { changeEncountState } from "../store/features/StatesSlice";
const enemyArr = [<Genkiman />, <Hentaiyou />, <Hukurou />];

function useEnemyData() {
  const [enemyComponents, setEnemyComponents] = useState([]);
  const [error, setError] = useState(null);
  const [isEnemiesSet, setIsEnemiesSet] = useState(false);
  const isEncount = useAppSelector((state) => state.StatesReducer.encountState);
  const sequence = useAppSelector(
    (state) => state.StatesReducer.battleSequence
  );
  const dispatch = useAppDispatch();
  const enemyDispatches = [
    (e: enemyStatusType) => dispatch(createEnemy1(e)),
    (e: enemyStatusType) => dispatch(createEnemy2(e)),
    (e: enemyStatusType) => dispatch(createEnemy3(e)),
  ];
  useEffect(() => {
    const emptyCompo = async () => {
      if (sequence === "end-player-win") {
        await wait(10000);
        setEnemyComponents([]);
      }
    };
    emptyCompo();
  }, [sequence]);
  useEffect(() => {
    if (isEncount) {
      //reset encounter
      dispatch(changeEncountState(false));
      //fetch enemies's data
      fetch(`${reuseValue.serverURL}/enemy/create`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(async (response) => {
        if (!response.ok) {
          if (response.status === 400) setError("incorrect password");
          else if (response.status === 404) setError("user doesnot exist");
          else setError("Something went wrong :<");
        } else {
          const data: Array<enemyDataStatusType> = await response.json();
          data.forEach((enemy, i) => {
            enemyDispatches[i]({
              name: enemy.name,
              hp: enemy.hp,
              at: enemy.at,
              exp: enemy.exp,
              MaxHp: enemy.hp,
            });
            console.log(enemy.name, "name", i);
            const enemyCompo = enemyArr.filter(
              (e) => e.type.name === enemy.name
            );
            setEnemyComponents((pre) => [...pre, enemyCompo]);
          });
          setIsEnemiesSet(true);
        }
      });
    }
  }, [isEncount]);

  useEffect(() => {
    setIsEnemiesSet(false);
  }, [sequence === "end-player-lose" || sequence === "end-player-win"]);

  return { enemyComponents, isEnemiesSet, setIsEnemiesSet };
}

export default useEnemyData;
