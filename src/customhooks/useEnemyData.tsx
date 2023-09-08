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
const enemyArr = [<Genkiman />, <Hentaiyou />, <Hukurou />];
type Props = {
  socket: socketType;
  sequence: sequenceType;
};
function useEnemyData({ socket }: socketType, sequence: sequenceType) {
  const [enemyComponents, setEnemyComponents] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();

  const enemyDispatches = [
    (e: enemyStatusType) => dispatch(createEnemy1(e)),
    (e: enemyStatusType) => dispatch(createEnemy2(e)),
    (e: enemyStatusType) => dispatch(createEnemy3(e)),
  ];
  useEffect(() => {
    const emptyCompo = async () => {
      if (sequence === "end-player-win") {
        // await wait(10000);
        setEnemyComponents([]);
      }
    };
    emptyCompo();
  }, [sequence]);
  useEffect(() => {
    socket.on("screenSwitch", (data) => {
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
          const data: Array<enemyDataStatusType> = await response.json();
          data.forEach((enemy, i) => {
            enemyDispatches[i]({
              name: enemy.name,
              hp: enemy.hp,
              at: enemy.at,
              exp: enemy.exp,
              MaxHp: enemy.hp,
            });

            const enemyCompo = enemyArr.filter(
              (e) => e.type.name === enemy.name
            );
            setEnemyComponents((pre) => [...pre, enemyCompo]);
          });

          console.log(data, ";lkj;kj;lkj");
        }
      });
    });
  }, [socket]);

  return { enemyComponents };
}

export default useEnemyData;
