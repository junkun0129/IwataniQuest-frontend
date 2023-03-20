import { useState } from "react";
import reactLogo from "./assets/react.svg";
//import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styles from "./App.module.scss";
import socketIO, { io, Socket, SocketOptions } from "socket.io-client";
import Hello from "./component/Hello";
import Game from "./mainroutes/Game";
import Signup from "./mainroutes/Signup";
import Login from "./mainroutes/Login";
import Home from "./mainroutes/Home";
import env from "ts-react-dotenv";
import { useNonInitialEffect } from "./customhooks/useNonInitialEffect";
import EnemiesManage from "./admincompo/EnemiesManage";
import reuseValue from "./reuseValue";

type walkType = {
  name: string;
  email: string;
  x: number;
  y: number;
};

type userType = {
  userId: string;
  email: string;
  name: string;
  status: {
    at: number;
    exp: number;
    hp: number;
    maxmumHp: number;
    level: number;
  };
  token: string;
};
export interface ServerToClientEvents {
  screenSwitch: (hit: string) => void;
  backSwitch: (backback: string) => void;
  save: (save: string) => void;
  pedestrians: (pedestrians: [walkType]) => void;
  newPedestrians: (newPedestrians: [walkType]) => void;
  tempoBack: (tempoBack: userType) => void;
  textOpentoField: (open: string) => void;
  textAppear: ({
    email,
    text,
  }: {
    email: string;
    text: string | undefined;
  }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  oi: (input: string) => void;
  encount: (encount: string) => void;
  back: (backback: string) => void;
  save: (save: string) => void;
  walk: ({ name, x, y }: walkType) => void;
  textOpen: (open: string) => void;
  textSubmit: ({
    email,
    text,
  }: {
    email: string;
    text: string | undefined;
  }) => void;
}
// const url:string = process.env.SERVER_URL;

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  reuseValue.serverURL
);

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/game" element={<Game socket={socket}></Game>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route
            path="/login"
            element={<Login socket={socket}></Login>}
          ></Route>
          <Route
            path="/admin/enemies"
            element={<EnemiesManage></EnemiesManage>}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
