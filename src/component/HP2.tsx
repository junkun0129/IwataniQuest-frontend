import * as React from "react";
import { Component } from "react";
import { motion } from "framer-motion";
import { Box } from "@mui/material";
type Props = { sceneState: number; dialog: string };
const HP2 = React.forwardRef(
  ({ sceneState, dialog }: Props, ref: React.Ref<HTMLDivElement>) => {
    return (
      <>
        <div
          ref={ref}
          style={{
            position: "relative",
            width: "100%",
            height: "240px",
            border: "10px solid white",
            borderRadius: "20px",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            //   background: `linear-gradient(to left, black ${
            //     (1 - hp / mxHp) * 100
            //   }%, lime ${(1 - hp / mxHp) * 100}% ${(hp / mxHp) * 100}%)`,
          }}
        >
          {dialog}
        </div>
      </>
    );
  }
);
export default motion(HP2);
