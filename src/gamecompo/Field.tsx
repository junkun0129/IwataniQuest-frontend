import * as React from "react";
import { Component, useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { GamePanel } from "../fieldcompo/GamePanel";
import { motion } from "framer-motion";
import styles from "./Field.module.scss";
import { useNonInitialEffect } from "../customhooks/useNonInitialEffect";
import { useAppDispatch, useAppSelector } from "../store/store";
import reuseValue from "../reuseValue";
import { afterSave, createUser } from "../store/features/userStatuSlice";
import { ClientToServerEvents, ServerToClientEvents } from "../types/type";
import {
  changeState,
  encountStateSlice,
} from "../store/features/battleStateSlice";

export type socketType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
};
function Field({ socket }: socketType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [game, setGame] = useState<GamePanel | null>(null);
  const [isEncount, setIsEncount] = useState<boolean>(false);
  const user = useAppSelector((state) => state.userStatusReducer);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isAppearInput, setIsAppearInput] = useState<boolean>(false);
  const [chat, setChat] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext("2d");
    if (!c) return;
    let game = new GamePanel(c, socket);
    setGame(game);
  }, []);

  useEffect(() => {
    game?.setup();
  }, [game]);
  useEffect(() => {
    game?.on("hit", (data) => {
      console.log(data);
      dispatch(changeState({ isEncount: true }));
    });
  }, [game]);

  useEffect(() => {
    socket.on("save", (data) => {
      console.log(data, "this is back you");
      fetch(`${reuseValue.serverURL}/user/save`, {
        method: "POST",
        body: JSON.stringify({
          name: user.name,
          level: user.status.level,
          at: user.status.at,
          exp: user.status.exp,
          hp: user.status.hp,
          x: data.x,
          y: data.y,
          mapState: data.mapState,
        }),
        headers: { "Content-Type": "application/json" },
      }).then(async (res) => {
        const data = await res.json();
        socket.emit("saveDone", {
          x: data.x,
          y: data.y,
          mapState: data.mapState,
        });

        console.log(data.mapState);
        dispatch(afterSave({ x: data.x, y: data.y, mapState: data.mapState }));
      });
    });
  }, [socket]);

  useEffect(() => {}, []);

  useEffect(() => {
    console.log(isAppearInput, "iiii");
    if (!isAppearInput) {
      window.addEventListener("keydown", (e) => {
        if (e.key === "t") {
          setIsAppearInput(true);
          setChat("");
          inputRef.current?.focus();
          socket.emit("textOpen", "open");
          // inputRef.current?.value = null;
        }
      });
    }
  }, []);

  const submitText = () => {
    console.log(inputRef.current?.value);
    socket.emit("textSubmit", {
      email: user.email,
      text: inputRef.current?.value,
    });
    setIsAppearInput(false);
    // inputRef.current?.value = "";
    socket.emit("textOpen", "close");
  };

  return (
    <>
      <motion.canvas
        className={styles.field}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></motion.canvas>
      <motion.div
        style={{ position: "absolute", zIndex: 5, top: 300, left: 500 }}
        animate={isAppearInput ? { opacity: 1 } : { opacity: 0 }}
      >
        <input
          ref={inputRef}
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitText();
            }
          }}
        />
        <button onClick={submitText}>submit</button>
      </motion.div>
    </>
  );
}

export default Field;
