import { useEffect, useState } from "react";
import { socketType } from "../gamecompo/Field";
import {
  createEnemy1,
  createEnemy2,
  createEnemy3,
  enemyDataStatusType,
  enemyStatusType,
} from "../store/features/enemySlice";
import { useAppDispatch } from "../store/store";
import reuseValue from "../reuseValue";
import Genkiman from "../enemycompo/Genkiman";
import Hentaiyou from "../enemycompo/Hentaiyou";
import Hukurou from "../enemycompo/Hukurou";
import { sequenceType } from "../types/type";
import { wait } from "../utils/wait";
import { enemiesData } from "../assets/enemiesData";
const enemyArr = [<Genkiman />, <Hentaiyou />, <Hukurou />];
type Props = {
  socket: socketType;
  sequence: sequenceType;
};
function useEnemyData({ socket }: socketType, sequence: sequenceType) {
  const [enemyComponents, setEnemyComponents] = useState([]);
  const [error, setError] = useState(null);
  const [isBattleStart, setIsBattleStart] = useState(false);
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
    socket.on("screenSwitch", async (data) => {
      console.log("gettttoooo");

      fetch(`${reuseValue.serverURL}/enemy/create`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(async (response) => {
        if (!response.ok) {
          if (response.status === 400) setError("incorrect password");
          else if (response.status === 404) setError("user doesnot exist");
          else setError("Something went wrong :<");
        } else {
          console.log("enemiiiiiiiikittaaa");
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
          setIsBattleStart(true);
          console.log(data, ";lkj;kj;lkj");
        }
      });

      // const generateAndDispatchEnemies = async () => {
      //   for (let i = 0; i <= 2; i++) {
      //     const randomNum = Math.floor(Math.random() * 3) + 1;
      //     const chosenOne = enemiesData[randomNum];
      //     enemyDispatches[i]({
      //       name: chosenOne.name,
      //       hp: chosenOne.hp,
      //       at: chosenOne.at,
      //       exp: chosenOne.exp,
      //       MaxHp: chosenOne.hp,
      //     });
      //     const enemyCompo = enemyArr.filter(
      //       (e) => e.type.name === chosenOne.name
      //     );
      //     setEnemyComponents((pre) => [...pre, enemyCompo]);
      //   }
      // };

      // // Call the function to generate and dispatch enemies
      // await generateAndDispatchEnemies();
      // console.log(enemyComponents, "ooo");
      // // Now, set IsBattleStart to true
      // setIsBattleStart(true);
    });
  }, [socket]);
  useEffect(() => {
    console.log(enemyComponents, "enemycompo");
  }, [enemyComponents]);
  useEffect(() => {
    setIsBattleStart(false);
  }, [sequence === "end-player-lose" || sequence === "end-player-win"]);

  return { enemyComponents, isBattleStart };
}

export default useEnemyData;
