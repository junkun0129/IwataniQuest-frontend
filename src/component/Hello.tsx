import * as React from "react";
import { Component } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../types/type";

type socketType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
};

function Hello({ socket }: socketType) {
  const [input, setInput] = useState("");
  const navi = useNavigate();

  const iwatani = 3;

  const handlesubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    localStorage.setItem("Input", input);
    console.log("button");
    socket.emit("oi", input);
    navi("/");
  };

  return (
    <>
      <h1>hello</h1>
      <form onSubmit={handlesubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          name="input"
        />

        <button type="submit">button</button>
      </form>
    </>
  );
}

export default Hello;
