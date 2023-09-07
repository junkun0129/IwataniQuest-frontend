import React from "react";

const calculateOccupationPercentage = (hpBarRect, enemyRect) => {
  // Calculate the overlap in both the horizontal and vertical directions
  const overlapWidth =
    Math.min(hpBarRect.right, enemyRect.right) -
    Math.max(hpBarRect.left, enemyRect.left);
  const overlapHeight =
    Math.min(hpBarRect.bottom, enemyRect.bottom) -
    Math.max(hpBarRect.top, enemyRect.top);

  // Calculate the area of overlap
  const overlapArea = overlapWidth * overlapHeight;

  // Calculate the area of the HP bar
  const hpBarArea = (hpBarRect.width || 1) * (hpBarRect.height || 1);

  // Calculate the percentage occupation
  const occupationPercentage = (overlapArea / hpBarArea) * 100;

  return occupationPercentage;
};

const EnemyVisualizer = ({ hpBarRect, enemyRect }) => {
  const occupationPercentage = calculateOccupationPercentage(
    hpBarRect,
    enemyRect
  );

  // Define styles for the visualizer bar
  const visualizerStyle: React.CSSProperties = {
    position: "absolute",
    background: "rgba(255, 0, 0, 0.5)", // Red with some transparency
    width: `${occupationPercentage}%`, // Width based on occupation percentage
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 1,
  };

  return <div style={visualizerStyle}></div>;
};

export default EnemyVisualizer;
