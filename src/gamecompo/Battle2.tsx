import React, { useEffect, useRef, useState } from "react";
import useEnemyData from "../customhooks/useEnemyData";
import Genkiman from "../enemycompo/Genkiman";
import Hentaiyou from "../enemycompo/Hentaiyou";
import Hukurou from "../enemycompo/Hukurou";
import { useAppDispatch, useAppSelector } from "../store/store";
import HPBar from "../component/HPBar";
import EnemyWrapper from "../utils/EnemyWrapper";
import { changeCollisionNum } from "../store/features/battleStateSlice";
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
import {
  changeBattleResult,
  changeBattleSequence,
} from "../store/features/StatesSlice";
const enemyArr = [<Genkiman />, <Hentaiyou />, <Hukurou />];

function Battle2({ socket }: socketType) {
  const enemyRefs = [useRef(null), useRef(null), useRef(null)];

  const sequence = useAppSelector(
    (state) => state.StatesReducer.battleSequence
  );
  const { isEnemiesSet, setIsEnemiesSet } = useEnemyData();

  const enemy1Selector = useAppSelector((state) => state.enemy1Reducer);
  const enemy2Selector = useAppSelector((state) => state.enemy2Reducer);
  const enemy3Selector = useAppSelector((state) => state.enemy3Reducer);
  const enemySelectors = [enemy1Selector, enemy2Selector, enemy3Selector];

  const playerStatus = useAppSelector(
    (state) => state.userStatusReducer.status
  );

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

  const { dialog } = useSequence(enemyControls, hpBarControl);

  const battleResult = useAppSelector(
    (state) => state.StatesReducer.battleResult
  );

  useEffect(() => {
    if (battleResult === "win") {
      dispatch(changeBattleSequence("field"));
    } else if (battleResult === "lose") {
      dispatch(changeBattleSequence("field"));
    }
  }, [battleResult]);

  useEffect(() => {
    dispatch(changeBattleSequence("start"));
    setIsEnemiesSet(false);
  }, [isEnemiesSet === true]);

  const handleDragEnd = (event) => {
    const collisionNum = collisionCheck(event, enemyRefs);
    if (collisionNum !== null) {
      dispatch(changeBattleSequence("player-action"));
      dispatch(changeCollisionNum({ collisionNum: collisionNum }));
    }
  };

  const handleClick = () => {
    const condition = (e: enemyStatusType) => e.hp <= 0;
    if (sequence === "start") {
      dispatch(changeBattleSequence("player-turn"));
    }
    if (enemySelectors.every(condition)) {
      console.log("alll defeated");
      dispatch(changeBattleSequence("end-player-win"));
    }
    if (sequence === "player-action") {
      dispatch(changeBattleSequence("enemy-action"));
    }

    if (sequence === "enemy-action") {
      if (playerStatus.hp <= 0) {
        //battle end you lose
        dispatch(changeBattleSequence("end-player-lose"));
      } else {
        dispatch(changeBattleSequence("player-turn"));
      }
    }
    if (sequence === "end-player-win") {
      console.log("pushed after win ");
      dispatch(changeBattleResult("win"));
      dispatch(changeBattleSequence("field"));
    }
    if (sequence === "end-player-lose") {
      dispatch(changeBattleResult("lose"));
      dispatch(changeBattleSequence("field"));
    }
  };

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
          {enemySelectors.map((enemySelector, i) => {
            return (
              <motion.div
                animate={
                  enemySelector?.hp <= 0 ? { opacity: 0 } : { opacity: 1 }
                }
                ref={enemyRefs[i]}
                style={{
                  border: "black solid  2px",
                  height: "250px",
                  width: "20%",
                }}
              >
                <div>{enemySelector?.name}</div>
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
                        (enemySelector?.hp / enemySelector?.MaxHp) * 100
                      }%`,
                    }}
                  ></motion.div>
                </div>
                <motion.div animate={enemyControls[i]}>
                  {enemyArr.filter(
                    (enemyCompo) => enemyCompo.type.name === enemySelector.name
                  )[0]
                    ? enemyArr.filter(
                        (enemyCompo) =>
                          enemyCompo.type.name === enemySelector.name
                      )[0]
                    : enemyArr[i]}
                </motion.div>
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
