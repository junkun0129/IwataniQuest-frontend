import React, { useEffect, useRef, useState } from "react";
import useEnemyData from "../customhooks/useEnemyData";
import Genkiman from "../enemycompo/Genkiman";
import Hentaiyou from "../enemycompo/Hentaiyou";
import Hukurou from "../enemycompo/Hukurou";
import { useAppDispatch, useAppSelector } from "../store/store";
import HPBar from "../component/HPBar";
import EnemyWrapper from "../utils/EnemyWrapper";
import {
  battleStateSliceType,
  changeCollisionNum,
} from "../store/features/battleStateSlice";
import {
  atackEnemy1,
  atackEnemy2,
  atackEnemy3,
  enemyStatusType,
} from "../store/features/enemySlice";
import { getAttackFromEnemy } from "../store/features/userStatuSlice";
import { motion, useAnimationControls } from "framer-motion";
import useHPBarAnimation from "../customhooks/useHPBarAnimation";
import useSequence from "../customhooks/useSequence";
import { sequenceType } from "../types/type";
import { socketType } from "./Field";
const enemyArr = [<Genkiman />, <Hentaiyou />, <Hukurou />];

function Battle2({ socket }: socketType) {
  const enemyRefs = [useRef(null), useRef(null), useRef(null)];
  const [sequence, setSequence] = useState<sequenceType>("field");

  const { enemyComponents, isBattleStart } = useEnemyData({ socket }, sequence);
  const enemy1Selector = useAppSelector((state) => state.enemy1Reducer);
  const enemy2Selector = useAppSelector((state) => state.enemy2Reducer);
  const enemy3Selector = useAppSelector((state) => state.enemy3Reducer);
  const collisionNumSlice = useAppSelector(
    (state) => state.collisionNumReducer
  );
  const playerStatus = useAppSelector(
    (state) => state.userStatusReducer.status
  );
  let [closestEnemy, setClosestEnemy] = useState(null);
  const enemySelectors = [enemy1Selector, enemy2Selector, enemy3Selector];

  const hpGage1 = useAnimationControls();
  const hpGage2 = useAnimationControls();
  const hpGage3 = useAnimationControls();
  const hpGages = [hpGage1, hpGage2, hpGage3];
  enemySelectors.forEach((enemy, i) => {
    useHPBarAnimation(hpGages[i], enemy.hp, enemy.MaxHp);
  });
  const dispatch = useAppDispatch();
  const enemyControl1 = useAnimationControls();
  const enemyControl2 = useAnimationControls();
  const enemyControl3 = useAnimationControls();
  const enemyControls = [enemyControl1, enemyControl2, enemyControl3];
  const hpBarControl = useAnimationControls();
  const { dialog, battleResult } = useSequence(
    sequence,
    enemyControls,
    hpBarControl
  );

  useEffect(() => {
    console.log(battleResult, "battleresult");
    if (battleResult === "win") {
      //go back socket
      setSequence("field");
    } else if (battleResult === "lose") {
      //reset socket
      setSequence("field");
    }
  }, [battleResult]);

  useEffect(() => {
    setSequence("start");
  }, [isBattleStart === true]);
  const handleDragEnd = (event) => {
    const collisionNum = collisionCheck(event, enemyRefs);
    console.log(collisionNum, "nnnnnnnnnnnnnnn");
    if (collisionNum !== null) {
      setSequence("player-action");
      dispatch(changeCollisionNum({ collisionNum: collisionNum }));
    }
  };

  useEffect(() => {
    console.log(collisionNumSlice, "9999999999");
  }, [collisionNumSlice]);

  const handleClick = () => {
    const condition = (e: enemyStatusType) => e.hp <= 0;
    if (enemySelectors.every(condition)) {
      setSequence("end-player-win");
    }
    if (sequence === "start") {
      setSequence("player-turn");
    }
    if (sequence === "player-action") {
      setSequence("enemy-action");
    }

    if (sequence === "enemy-action") {
      if (playerStatus.hp <= 0) {
        //battle end you lose
        setSequence("end-player-lose");
      } else {
        setSequence("player-turn");
      }
    }
    if (sequence === "end-player-win") {
      socket.emit("back", "backback");
    }
    if (sequence === "end-player-lose") {
      socket.emit("lose", "toServer");
    }
  };
  useEffect(() => {
    console.log(enemyComponents, "compooooooooo");
  }, [enemyComponents]);
  return (
    <>
      <div
        style={{
          backgroundImage: `url('img/battle1.jpg')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "100%",
          width: "100%",
        }}
      >
        <h1>llll</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          {enemyComponents.map((enemyCompo, i) => {
            return (
              <motion.div
                animate={
                  enemySelectors[i]?.hp <= 0 ? { opacity: 0 } : { opacity: 1 }
                }
                ref={enemyRefs[i]}
                style={{
                  border: "black solid  2px",
                  height: "250px",
                  width: "20%",
                }}
              >
                <div>{enemySelectors[i]?.name}</div>
                <div
                  style={{
                    width: "60%",
                    height: "7%",
                    backgroundColor: "gray",
                  }}
                >
                  <motion.div
                    animate={hpGages[i]}
                    style={{
                      backgroundColor: "red",
                      height: "100%",
                      width: `${
                        (enemySelectors[i]?.hp / enemySelectors[i]?.MaxHp) * 100
                      }%`,
                    }}
                  ></motion.div>
                </div>
                <motion.div animate={enemyControls[i]}>{enemyCompo}</motion.div>
              </motion.div>
            );
          })}
        </div>
        <div
          style={{
            height: "30%",
            marginTop: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <HPBar
            animate={hpBarControl}
            enemyRefs={enemyRefs}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragTransition={{ bounceStiffness: 500, bounceDamping: 20 }}
            dragElastic={0.8}
            whileTap={{ scale: 1.2 }}
            onDragEnd={handleDragEnd}
            dialog={dialog}
            onTap={handleClick}
          ></HPBar>
        </div>
      </div>
    </>
  );
}
const collisionCheck = (
  event: any,
  enemyRefs: React.RefObject<HTMLElement>[]
) => {
  const hpBar = event.target;
  const hpBarRect = hpBar.getBoundingClientRect();
  console.log(";lkj");
  // Calculate the middle of the HP bar
  const hpBarMiddleX = (hpBarRect.left + hpBarRect.right) / 2;
  const hpBarMiddleY = (hpBarRect.top + hpBarRect.bottom) / 2;

  let closestEnemy = null;
  let collisionNum = null;
  let closestDistance = Number.MAX_VALUE;

  enemyRefs.forEach((enemyRef, i) => {
    if (enemyRef.current) {
      const enemyRect = enemyRef.current.getBoundingClientRect();

      // Calculate the middle of the enemy
      const enemyMiddleX = (enemyRect.left + enemyRect.right) / 2;
      const enemyMiddleY = (enemyRect.top + enemyRect.bottom) / 2;

      // Check if the HP bar's bottom is above the enemy's top
      const verticalCollision = hpBarRect.bottom >= enemyRect.bottom - 100;

      console.log("vertical clear!!!");
      if (verticalCollision) {
        // Calculate the distance from the HP bar to the enemy
        const distance = Math.sqrt(
          Math.pow(hpBarMiddleX - enemyMiddleX, 2) +
            Math.pow(hpBarMiddleY - enemyMiddleY, 2)
        );

        if (distance < closestDistance) {
          closestEnemy = enemyRef.current;
          closestDistance = distance;
          collisionNum = i;
        }
      }
    }
  });

  if (closestEnemy) {
    // You can perform actions here, e.g., attacking the closest enemy
    console.log(collisionNum, "collisionNum");
    return collisionNum;
  }

  return collisionNum;
};
export default Battle2;
