import { Paper } from "@mui/material";
import * as React from "react";
import { Component } from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const navi = useNavigate();
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "720px",
          display: "flex",
          flexWrap: "wrap",
          // alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "red",
          backgroundImage: "url(img/IwataniQuest-home.png)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          // flexDirection: "column",

          overflow: "scroll",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "380%",
            backgroundColor: "black",
            opacity: 0.4,
            position: "absolute",
          }}
        ></div>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            position: "relative",
          }}
        >
          <div
            style={{
              backgroundImage: "url(img/gameLogo.png)",
              backgroundSize: "cover",
              width: "50%",
              height: "70%",
              position: "absolute",
              left: "25%",
              top: "17%",
            }}
          ></div>
        </div>
        <Paper
          elevation={3}
          sx={{ width: "80%", height: "500px", marginTop: "100px", zIndex: 2 }}
        >
          <h1>;lk</h1>
        </Paper>
        <Paper
          elevation={3}
          sx={{ width: "80%", height: "500px", marginTop: "100px", zIndex: 2 }}
        >
          plkj;lkj
        </Paper>
        <Paper
          elevation={3}
          sx={{ width: "80%", height: "500px", marginTop: "100px", zIndex: 2 }}
        >
          plkj;lkj
        </Paper>
      </div>
    </>
  );
}

export default Home;
