import * as React from "react";
import { Component } from "react";
import styles from "./Battle.module.scss";
import {
  motion,
  MotionValue,
  motionValue,
  useAnimationControls,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { socketType } from "./Field";
import { useState, useEffect, useRef } from "react";
import Genkiman from "../enemycompo/Genkiman";
import { star } from "./SvgPath";
import Hentaiyou from "../enemycompo/Hentaiyou";
import HP from "../component/HP";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  maketozero1,
  maketozero2,
  maketozero3,
  atackEnemy1,
  atackEnemy2,
  atackEnemy3,
  createEnemy1,
  createEnemy2,
  createEnemy3,
} from "../store/features/enemySlice";
import {
  restoreHP,
  getAttackFromEnemy,
  getExp,
} from "../store/features/userStatuSlice";
import { enemyStatusType } from "../store/features/enemySlice";
import { useNonInitialEffect } from "../customhooks/useNonInitialEffect";
import reuseValue from "../reuseValue";
import HP2 from "../component/HP2";

export type enemeyStatusType = {
  hp: number;
  at: number;
};

type Coordinate = { left: number; right: number; top: number; bottom: number };
function Battle({ socket }: socketType) {
  // const [isEncount, setIsEncount] = useState<boolean>(false);
  const [enemyDragState, setEnemyDragState] = useState(0);
  const [whichEnemyAt, setWhichEnemyAt] = useState(0);

  const battleOffScene = 0;
  const appearedScene = 1;
  const yourTurnScene = 2;
  const yourActionScene = 3;
  const enemiesTurnScene = 4;
  const enemiesActionScene = 5;
  const afterEnemyActionScene = 6;
  const afterBattleScene = 7;
  const switchBackScene = 8;
  const [sceneState, setSceneState] = useState<number>(0);
  const userAt = useAppSelector(
    (state) => state.reducer.userStatusReducer.status.at
  );
  const user = useAppSelector((state) => state.reducer.userStatusReducer);

  const BoxRef1 = useRef<HTMLDivElement | null>(null);
  const BoxRef2 = useRef<HTMLDivElement | null>(null);
  const BoxRef3 = useRef<HTMLDivElement | null>(null);

  const BoxRefs = [BoxRef1, BoxRef2, BoxRef3];

  const dispatch = useAppDispatch();
  const enemy1Selector = useAppSelector((state) => state.reducer.enemy1Reducer);
  const enemy2Selector = useAppSelector((state) => state.reducer.enemy2Reducer);
  const enemy3Selector = useAppSelector((state) => state.reducer.enemy3Reducer);
  const enemySelectors = [enemy1Selector, enemy2Selector, enemy3Selector];
  const enemyFieldBottomLine = useRef(0);
  const [enemyCoordinates, setEnemyCoordinates] = useState<any>(null);
  const attackAreaBorder = useRef();
  let [totalExp, setTotalExp] = useState(0);

  const [shapeState, setShapeState] = useState(0);

  const [error, setError] = useState("");
  const appearDialog = "Enemy appeared!!";
  const yourturnDialog = "Your turn";
  const [enemyturnDialog, setEnemyturnDialog] = useState("");
  const youractionDialog = "attack to enemy";
  const afterEnemyActionDialog = "you got 4 damage";
  const BattleResultDialog = `${user.name} got ${totalExp} exp`;

  const HpBarControl = useAnimationControls();
  const enemyDispatches = [
    (e: enemyStatusType) => dispatch(createEnemy1(e)),
    (e: enemyStatusType) => dispatch(createEnemy2(e)),
    (e: enemyStatusType) => dispatch(createEnemy3(e)),
  ];

  const [dialog, setDialog] = useState<string>("");
  let dragX = useMotionValue(0);
  let dragY = useMotionValue(0);

  const [drag, setDrag] = useState(0);
  const [MaxHp, setMaxHp] = useState<Array<number>>([]);

  const enemyArr = [<Genkiman />, <Hentaiyou />];
  let enemycomponents: Array<JSX.Element | null> = [null, null, null];
  useEffect(() => {
    socket.on("screenSwitch", (data) => {
      console.log("entounttttttttttt");

      setSceneState(appearedScene);

      fetch(`${reuseValue.serverURL}/enemy/create`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then(async (response) => {
          if (!response.ok) {
            if (response.status === 400) setError("incorrect password");
            else if (response.status === 404) setError("user doesnot exist");
            else setError("Something went wrong :<");
          } else {
            const data: Array<enemyStatusType> = await response.json();
            data.forEach((enemy, i) => {
              enemyDispatches[i](enemy);
              setMaxHp((pre) => [...pre, enemy.hp]);
              setTotalExp((totalExp = totalExp + enemy.exp));
            });
          }
        })
        .then(() => {
          setSceneState(1);
        });
    });
  }, [socket]);

  const [startover, setStartover] = useState(0);

  //dialog change
  useNonInitialEffect(() => {
    switch (sceneState) {
      case appearedScene:
        setDialog(appearDialog);
        break;
      case yourTurnScene:
        setDialog(yourturnDialog);
        break;
      case yourActionScene:
        setDialog(youractionDialog);
        break;
      case enemiesTurnScene:
        setDialog(enemyturnDialog);
        break;
      case afterEnemyActionScene:
        setDialog(afterEnemyActionDialog);
        break;
      case afterBattleScene:
        setDialog(BattleResultDialog);
        break;
      default:
        break;
    }

    const coodinatesBuffer = BoxRefs.map((ref, i) => {
      return {
        left: ref.current?.getBoundingClientRect().left,
        right: ref.current?.getBoundingClientRect().right,
        top: ref.current?.getBoundingClientRect().top,
        bottom: ref.current?.getBoundingClientRect().bottom,
      };
    });
    setEnemyCoordinates(coodinatesBuffer);
    console.log(enemyCoordinates, "cooooooooo");
    console.log(
      BoxRefs.map((ref, i) => {
        return {
          left: ref.current?.getBoundingClientRect().left,
          right: ref.current?.getBoundingClientRect().right,
          top: ref.current?.getBoundingClientRect().top,
          bottom: ref.current?.getBoundingClientRect().bottom,
        };
      })
    );
  }, [sceneState]);

  //mouse move position
  let X = useMotionValue(0);
  let Y = useMotionValue(0);
  const swordShape = 1;
  useMotionValueEvent(X || Y, "change", () => {
    if (Y.get() < enemyFieldBottomLine.current) {
      setShapeState(swordShape);
    } else {
      setShapeState(0);
    }
  });
  //mouse end position
  const dragEndX = useMotionValue(0);
  const dragEndY = useMotionValue(0);
  const [chosenNum, setChosenNum] = useState<null | number>(null);
  useMotionValueEvent(dragEndX || dragEndY, "change", () => {
    if (sceneState === yourTurnScene) {
      enemyCoordinates &&
        enemyCoordinates.forEach((coordinate, i) => {
          if (
            coordinate.left < dragEndX.get() &&
            dragEndX.get() < coordinate.right &&
            coordinate.top < dragEndY.get() &&
            dragEndY.get() < coordinate.bottom
          ) {
            setChosenNum(i);
          }
        });
    }
  });

  //attack from enemies
  const enemyControll1 = useAnimationControls();
  const enemyControll2 = useAnimationControls();
  const enemyControll3 = useAnimationControls();
  const enemyControlls = [enemyControll1, enemyControll2, enemyControll3];
  const [activeEnemyNum, setActiveEnemyNum] = useState(0);

  useNonInitialEffect(() => {
    setActiveEnemyNum(Math.floor(Math.random() * 3));
    setEnemyturnDialog(
      `${enemySelectors[activeEnemyNum].name} is about attack you`
    );
  }, [sceneState === enemiesTurnScene]);

  useNonInitialEffect(() => {
    enemyControlls[activeEnemyNum]
      .start({
        scale: [2, 2, 2, 1, 1],
        rotate: [0, 0, 50, -50, 0],
      })
      .then(() => {
        dispatch(
          getAttackFromEnemy({ attack: enemySelectors[activeEnemyNum].at })
        );
      })
      .then(() => {
        if (
          enemySelectors
            .map((enemy, i) => {
              return enemy.hp;
            })
            .every((hp) => hp <= 0)
        ) {
          setSceneState(afterBattleScene);
        } else {
          setSceneState(yourTurnScene);
        }
      });
  }, [sceneState === enemiesActionScene]);

  //ontap hpBar
  const hpBarOnTap = () => {
    if (sceneState === appearedScene || sceneState === enemiesTurnScene) {
      setSceneState(sceneState + 1);
    }
    console.log(sceneState);
    if (sceneState === afterBattleScene) {
      let allExp = 0;
      enemySelectors.forEach((enemy) => {
        allExp += enemy.exp;
      });
      setSceneState(switchBackScene);
      dispatch(getExp({ exp: allExp }));
    }

    // //defeted all enemy
    if (
      enemySelectors
        .map((enemy, i) => {
          return enemy.hp;
        })
        .every((hp) => hp <= 0)
    ) {
      setSceneState(switchBackScene);
    }
  };

  //back to the field
  useNonInitialEffect(() => {
    console.log("backcccccc");
    socket.emit("back", "backback");
    setSceneState(0);
  }, [sceneState === switchBackScene]);
  return (
    <>
      <motion.div
        transition={
          sceneState === enemiesActionScene
            ? {
                times: [0, 0.5, 0.6, 0.7, 1],
                duration: 0.5,
                delay: 1,
              }
            : {}
        }
        animate={
          sceneState === enemiesActionScene && {
            rotate: [0, -5, 10, -5, 0],
          }
        }
        className={styles.innnerBattleBox}
      >
        <div
          className={styles.enemeyField}
          ref={(el) => {
            if (!el) return;
            enemyFieldBottomLine.current = el.getBoundingClientRect().bottom;
          }}
        >
          {enemySelectors.map((enemy, i) => {
            const enemyCompo = enemyArr.filter(
              (e) => e.type.name === enemy.name
            );
            return (
              <motion.div
                animate={enemy.hp <= 0 ? { opacity: 0 } : { opacity: 1 }}
                style={{ border: "black 9px solid" }}
                ref={BoxRefs[i]}
              >
                <div>{enemy.hp}</div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: 400,
                    height: 40,
                  }}
                >
                  <div className={styles.enemyName}>{enemy.name}</div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",

                      width: "60%",
                      height: "70%",
                      background: `linear-gradient(to left, black ${
                        (1 - enemy.hp / MaxHp[i]) * 100
                      }%, red ${(1 - enemy.hp / MaxHp[i]) * 100}% ${
                        (enemy1Selector.hp / MaxHp[i]) * 100
                      }%)`,
                      borderRadius: "10px",
                      border: "solid white 5px",
                    }}
                  ></div>
                </div>
                <motion.div animate={enemyControlls[i]}>
                  {enemyCompo}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <div
          ref={(el) => {
            if (!el) return;
            console.log(el.getBoundingClientRect().width);
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3,
            width: "100%",
            height: "35%",
          }}
          className={styles.hp}
        >
          {/* <HP
            dialog={dialog}
            sceneState={sceneState}
            dragX={(x) => dragX.set(x)}
            dragY={(y) => dragY.set(y)}
            dragState={(i) => setDrag(i)}
            enemyDragState={(d) => setEnemyDragState(d)}
            childSceneState={(s) => setSceneState(s)}
            startover={startover}
            enemyAttackNum={(n) => setWhichEnemyAt(n)}
          ></HP> */}
          <HP2
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragTransition={{ bounceStiffness: 500, bounceDamping: 20 }}
            dragElastic={0.8}
            onDrag={(event, info) => {
              X.set(info.point.x);
              Y.set(info.point.y);
            }}
            onDragEnd={(event, info) => {
              dragEndX.set(info.point.x);
              dragEndY.set(info.point.y);
            }}
            whileDrag={{ scale: 0.4 }}
            animate={HpBarControl}
            onTap={hpBarOnTap}
            //Props
            sceneState={sceneState}
            dialog={dialog}
            shapeState={shapeState}
            chosenNum={chosenNum}
            setSceneState={(state) => setSceneState(state)}
            setChosenNum={(num) => setChosenNum(num)}
          ></HP2>
        </div>

        <div className={styles.option}>
          <motion.div
            className={styles.shield}
            animate={
              drag === 2
                ? {
                    width: "50%",
                    height: "100%",
                  }
                : {}
            }
          >
            shield
          </motion.div>
          <motion.div
            className={styles.item}
            animate={
              drag === 3
                ? {
                    width: "50%",
                    height: "100%",
                  }
                : {}
            }
          >
            item
          </motion.div>
        </div>
        <button
          onClick={(e) => {
            dispatch(restoreHP({ hp: 20 }));
          }}
        >
          restore
        </button>
        <button
          onClick={(e) => {
            dispatch(maketozero1());
          }}
        >
          ;alskj
        </button>
        <button
          onClick={(e) => {
            dispatch(maketozero2());
          }}
        >
          ;alskj
        </button>
        <button
          onClick={(e) => {
            dispatch(maketozero3());
          }}
        >
          ;alskj
        </button>
        <h1>chosenNum : {chosenNum}</h1>
        <h1>sceneState : {sceneState}</h1>
      </motion.div>
    </>
  );
}

export default Battle;
