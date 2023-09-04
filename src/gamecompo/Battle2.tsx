import React, { useEffect, useRef, useState } from "react";
import { socketType } from "./Field";
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
} from "../store/features/enemySlice";
import { getAttackFromEnemy } from "../store/features/userStatuSlice";
import { motion, useAnimationControls } from "framer-motion";
import useHPBarAnimation from "../customhooks/useHPBarAnimation";
import useSequence from "../customhooks/useSequence";

const enemyArr = [<Genkiman />, <Hentaiyou />, <Hukurou />];

function Battle2({ socket }: socketType) {
  const enemyRefs = [useRef(null), useRef(null), useRef(null)];
  const { enemyComponents } = useEnemyData({ socket });
  const enemy1Selector = useAppSelector((state) => state.enemy1Reducer);
  const enemy2Selector = useAppSelector((state) => state.enemy2Reducer);
  const enemy3Selector = useAppSelector((state) => state.enemy3Reducer);
  const playerStatus = useAppSelector(
    (state) => state.userStatusReducer.status
  );
  let [closestEnemy, setClosestEnemy] = useState(null);
  const enemySelectors = [enemy1Selector, enemy2Selector, enemy3Selector];
  const [enemyHP, setEnemyHP] = useState([
    enemy1Selector.hp,
    enemy2Selector.hp,
    enemy3Selector.hp,
  ]);
  const hpGage1 = useAnimationControls();
  const hpGage2 = useAnimationControls();
  const hpGage3 = useAnimationControls();
  const hpGages = [hpGage1, hpGage2, hpGage3];
  enemySelectors.forEach((enemy, i) => {
    useHPBarAnimation(hpGages[i], enemy.hp, enemy.MaxHp);
  });
  const dispatch = useAppDispatch();
  const [sequence, setSequence] = useState("start");
  const enemyControl1 = useAnimationControls();
  const enemyControl2 = useAnimationControls();
  const enemyControl3 = useAnimationControls();
  const enemyControls = [enemyControl1, enemyControl2, enemyControl3];
  const hpBarControl = useAnimationControls();
  const { dialog } = useSequence(sequence, enemyControls, hpBarControl);
  const handleDragEnd = (event) => {
    const collisionNum = collisionCheck(event, enemyRefs);
    setSequence("player-action");
    if (collisionNum) {
      dispatch(changeCollisionNum({ collisionNum: collisionNum }));
    }
  };

  const handleClick = () => {
    if (sequence === "start") {
      setSequence("player-action");
    }
    if (sequence === "player-action") {
      setSequence("enemy-action");
    }
    if (sequence === "enemy-action") {
      if (playerStatus.hp <= 0) {
        //battle end you lose
      } else {
        setSequence("player-action");
      }
    }
  };

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
                <motion.div
                  animate={hpGages[i]}
                  style={{
                    backgroundColor: "red",
                    height: "100%",
                    width: `${(enemyHP[i] / enemySelectors[i].MaxHp) * 100}%`,
                  }}
                ></motion.div>
              </div>
              <motion.div animate={enemyControls[i]}>{enemyCompo}</motion.div>
            </div>
          );
        })}
      </div>
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
      const verticalCollision =
        hpBarRect.bottom >= enemyRect.top && hpBarRect.top <= enemyRect.bottom;

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

    return collisionNum;
  }

  return collisionNum;
};
export default Battle2;
