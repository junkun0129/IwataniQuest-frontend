import { AnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  atackEnemy1,
  atackEnemy2,
  atackEnemy3,
} from "../store/features/enemySlice";
import { getAttackFromEnemy } from "../store/features/userStatuSlice";
import { changeCollisionNum } from "../store/features/battleStateSlice";

const useSequence = (
  sequence: sequenceType,
  enemyControls: AnimationControls[],
  hpBarControl: AnimationControls
) => {
  const [dialog, setDialog] = useState("");
  const dispatch = useAppDispatch();
  const collisionNum = useAppSelector(
    (state) => state.collisionNumReducer.collisionNum
  );
  const playerStatus = useAppSelector(
    (state) => state.userStatusReducer.status
  );
  const enemy1Selector = useAppSelector((state) => state.enemy1Reducer);
  const enemy2Selector = useAppSelector((state) => state.enemy2Reducer);
  const enemy3Selector = useAppSelector((state) => state.enemy3Reducer);

  const enemySelectors = [enemy1Selector, enemy2Selector, enemy3Selector];
  const enemyAttacks = [atackEnemy1, atackEnemy2, atackEnemy3];

  useEffect(() => {
    const animateHpBar = async () => {
      if (sequence) {
        switch (sequence) {
          case "start": {
            setDialog("you ran into enemies!!!");
            break;
          }
          case "player-turn": {
            setDialog("your turn");
            break;
          }
          case "player-action": {
            // Only execute this block when collisionNum is not null
            setDialog("attackkkkkkuuuu");
            await hpBarControl.start({
              x: 100,
              y: 50,
              rotate: 100,
              transition: {
                duration: 1,
              },
            });

            // After the first animation is complete, reset the hpBar properties
            await hpBarControl.start({
              rotate: 0,
              x: 0,
              y: 0,
              borderRadius: "10px",
            });

            setDialog(`damage to enemy`);
            dispatch(enemyAttacks[collisionNum]({ atack: playerStatus.at }));
            dispatch(changeCollisionNum({ collisionNum: null }));

            break;
          }

          case "enemy-action": {
            const AINum = Math.floor(Math.random() * 3);

            setDialog(`${enemySelectors[AINum].name} attacks you`);

            await enemyControls[AINum].start({
              scale: [2, 2, 2, 1, 1],
              rotate: [0, 0, 50, -50, 0],
              transition: { duration: 1 },
            });
            setDialog(`you got ${enemySelectors[AINum].at} damage`);
            dispatch(getAttackFromEnemy({ attack: enemySelectors[AINum].at }));
            break;
          }

          case "end-player-win": {
            setDialog("you defeated all the enemies!!");
            break;
          }
          case "end-player-lose": {
            setDialog("you defeated all the enemies!!");
            break;
          }
          default:
            break;
        }
      }
    };

    animateHpBar(); // Call the async function
  }, [sequence, collisionNum]);

  return { dialog };
};

export default useSequence;
