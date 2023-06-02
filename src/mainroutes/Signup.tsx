import * as React from "react";
import { Component } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import reuseValue from "../reuseValue";
import { Box, Button, TextField } from "@mui/material";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const [contents, setContents] = useState(null);
  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    console.log(JSON.stringify({ email, name, password }));

    fetch(`${reuseValue.serverURL}/auth/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (response) => {
        const data = await response.json();
        console.log(data, "this is response");
        if (data === "user exists") {
          setError("user already exists");
        } else {
          console.log(data, "back from server");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      <div
        style={{
          // backgroundColor: "red",
          backgroundImage: "url(img/screenshot-2.png)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "720px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            opacity: 0.4,
            position: "absolute",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        >
          <h1 style={{ color: "white", zIndex: "1" }}>Signup</h1>
          <form
            onSubmit={submitForm}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "25%",
              height: 400,
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
              color="success"
              label="email"
              onChange={(e) => setEmail(e.target.value)}
              variant="filled"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // height: "10%",
              }}
            />
            <TextField
              type="text"
              name="password"
              value={password}
              label="password"
              color="success"
              variant="filled"
              onChange={(e) => setPassword(e.target.value)}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
            <TextField
              type="text"
              name="name"
              value={name}
              color="success"
              label="username"
              variant="filled"
              onChange={(e) => setName(e.target.value)}
              style={{
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
              submit
            </Button>
          </form>
        </div>
        {error && <h1>{error}</h1>}
      </div>
    </>
  );
}

export default Signup;
