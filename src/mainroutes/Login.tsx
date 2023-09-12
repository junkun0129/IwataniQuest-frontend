import * as React from "react";
import { Component, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socketType } from "../gamecompo/Field";
import reuseValue from "../reuseValue";
import { createUser } from "../store/features/userStatuSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { Button, TextField } from "@mui/material";
function Login({ socket }: socketType) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [error, setError] = useState("");
  const userStatusDispach = useAppDispatch();
  const userStatus = useAppSelector((state) => state.userStatusReducer);
  const navigate = useNavigate();

  const loginsubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmit(true);
    setError("");
    console.log({ email, password }, "this is it");
    fetch(`${reuseValue.serverURL}/auth/signin`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 400) setError("incorrect password");
          else if (response.status === 404) setError("user doesnot exist");
          else setError("Something went wrong :<");
        } else {
          console.log(response.ok);
          const data = await response.json();
          userStatusDispach(
            createUser({
              userId: data.userId,
              email: data.email,
              name: data.name,
              status: {
                at: data.status.at,
                exp: data.status.exp,
                requireExp: data.status.requireExp,
                hp: data.status.hp,
                maxmumHp: data.status.maxmumHp,
                level: data.status.level,
                x: data.status.x,
                y: data.status.y,
                mapState: data.status.mapState,
              },
            })
          );

          console.log(
            data.status.mapState,
            "oooooooooooooooooooooooooooooooooo"
          );

          navigate("/game");
        }
      })
      .catch((error) => {
        setError(error.message || "Something went wrong");
      })
      .finally(() => setIsSubmit(false));
  };

  return (
    <>
      {error && <h1>{error}</h1>}
      <div
        style={{
          flexDirection: "column",
          height: "720px",
          backgroundImage: "url(img/screenshot-3.png)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundColor: "beige",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            opacity: 0.4,
          }}
        ></div>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h1 style={{ color: "white", zIndex: "1" }}>login</h1>
          <form
            onSubmit={loginsubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "25%",
              height: 350,
              borderRadius: "20px",
              opacity: 0.9,
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <TextField
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color="success"
              label="email"
              variant="filled"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
            <TextField
              type="text"
              name="password"
              value={password}
              color="success"
              label="password"
              variant="filled"
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
            <Button
              color="success"
              variant="contained"
              style={{ width: "50%", borderRadius: "20px" }}
              type="submit"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
