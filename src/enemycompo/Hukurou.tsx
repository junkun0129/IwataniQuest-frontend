import { motion, useMotionValue, useTransform } from "framer-motion";
import * as React from "react";
import { Component } from "react";
function Hukurou() {
  const bodyY = useMotionValue(1);
  const leftWing = useTransform(bodyY, [10, 0, -20], [240, 220, 200]);
  const rightWing = useTransform(bodyY, [10, 0, -20], [120, 140, 160]);
  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    height: "300px",
    width: "100%",
    fontSize: "200px",
  };
  return (
    <div style={style}>
      <motion.div
        style={{
          fontSize: "150px",
          transform: "rotate(220deg)",
          marginTop: "90px",
          marginRight: "-110px",
          rotate: leftWing,
        }}
      >
        🪬
      </motion.div>
      <motion.div
        animate={{
          y: [10, -20, 2],
        }}
        transition={{
          repeat: 1000,
          repeatType: "mirror",
          times: [0, 0.5, 1],
          duration: 2,
        }}
        style={{ fontSize: "200px", zIndex: "1", y: bodyY }}
      >
        🦉
      </motion.div>
      <motion.div
        style={{
          fontSize: "150px",
          transform: "rotate(140deg)",
          marginTop: "90px",
          marginLeft: "-110px",
          rotate: rightWing,
        }}
      >
        🪬
      </motion.div>
    </div>
  );
}

export default Hukurou;
