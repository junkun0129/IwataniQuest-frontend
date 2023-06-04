import { Card, CardMedia, Paper } from "@mui/material";
import * as React from "react";
import { Component } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "video-react";
import styles from "./Home.module.scss";
function Home() {
  const navi = useNavigate();
  return (
    <>
      <div
        className={styles.box}
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
              top: "30%",
            }}
          ></div>
        </div>
        <div
          style={{
            width: "80%",
            height: "400px",
            marginTop: "100px",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: "black",
            color: "white",
            border: "white solid 10px",
            borderRadius: "30px",
          }}
        >
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <video width="90%" height="100%" loop autoPlay muted>
              <source src="video/game-start.mp4"></source>
            </video>
          </div>
          <div
            style={{
              width: "40%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "2rem",
              fontFamily: "monospace",
            }}
          >
            this is the game starts from small village
          </div>
        </div>
        <div
          style={{
            width: "80%",
            height: "400px",
            marginTop: "100px",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: "black",
            color: "white",
            border: "white solid 10px",
            borderRadius: "30px",
          }}
        >
          <div
            style={{
              width: "35%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "2rem",
              fontFamily: "monospace",
            }}
          >
            Go to the world and defeat monsters. in order to do that, just drag
            your HP bar and drop it!
          </div>
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <video width="90%" height="100%" loop autoPlay muted>
              <source src="video/battle-scene.mp4"></source>
            </video>
          </div>
        </div>
        <div
          style={{
            width: "80%",
            height: "400px",
            marginTop: "100px",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: "black",
            color: "white",
            border: "white solid 10px",
            borderRadius: "30px",
          }}
        >
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <video width="90%" height="100%" loop autoPlay muted>
              <source src="video/newVillege.mp4"></source>
            </video>
          </div>
          <div
            style={{
              width: "30%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "2rem",
              fontFamily: "monospace",
            }}
          >
            Go to new village and see the people around the map
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
