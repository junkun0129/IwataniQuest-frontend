import * as React from "react";
import { Component } from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const navi = useNavigate();
  return (
    <>
      <div
        style={{
          width: 500,
          height: 500,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // backgroundColor: "red",
          flexDirection: "column",
        }}
      >
        <h1>Home</h1>
        <h1
          style={{
            color: "white",
            border: "white 10px solid",
            padding: "5%",
            borderRadius: "20px",
            cursor: "pointer",
          }}
          onClick={() => navi("/signup")}
        >
          sign up
        </h1>
        <h1
          style={{
            color: "white",
            border: "white 10px solid",
            padding: "5%",
            borderRadius: "20px",
            cursor: "pointer",
          }}
          onClick={(e) => navi("/login")}
        >
          login
        </h1>
        <h1
          style={{
            color: "white",
            border: "white 10px solid",
            padding: "5%",
            borderRadius: "20px",
            cursor: "pointer",
          }}
          onClick={() => navi("/game")}
        >
          game
        </h1>
      </div>
    </>
  );
}

export default Home;
