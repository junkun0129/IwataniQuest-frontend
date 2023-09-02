import * as React from "react";
import { Component } from "react";

function EnemyWrapper({ children }, ref) {
  return React.cloneElement(children, { ref });
}

export default React.forwardRef(EnemyWrapper);
