import * as React from "react";
import { Component } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import reuseValue from "../reuseValue";

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // backgroundColor: "red",
        }}
      >
        <h1>Signup</h1>
        <form
          onSubmit={submitForm}
          style={{
            display: "flex",
            flexDirection: "column",
            width: 500,
            height: 400,
            justifyContent: "space-around",
            alignItems: "center",
            // backgroundColor: "red",
          }}
        >
          <input
            type="text"
            name="email"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
              height: "10%",
              borderRadius: "20px",
            }}
          />
          <input
            type="text"
            name="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
              height: "10%",
              borderRadius: "20px",
            }}
          />
          <input
            type="text"
            name="name"
            value={name}
            placeholder="username"
            onChange={(e) => setName(e.target.value)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "80%",
              height: "10%",
              borderRadius: "20px",
            }}
          />
          <button
            style={{ width: "80%", height: "10%", borderRadius: "20px" }}
            type="submit"
          >
            button
          </button>
        </form>
        {error && <h1>{error}</h1>}
      </div>
    </>
  );
}

export default Signup;
