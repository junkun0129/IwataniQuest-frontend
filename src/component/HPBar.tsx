import React from "react";
import { motion } from "framer-motion";

type HPBarProps = {
  enemyRefs: React.RefObject<HTMLElement>[];
};

const HPBar = ({ enemyRefs }: HPBarProps) => {
  const checkCollisions = (hpBarRect, enemyRect) => {
    // Check for horizontal collision (x-axis)
    const horizontalCollision =
      hpBarRect.right >= enemyRect.left && hpBarRect.left <= enemyRect.right;

    // Check for vertical collision (y-axis)
    const verticalCollision =
      hpBarRect.bottom >= enemyRect.top && hpBarRect.top <= enemyRect.bottom;

    // Return true if there's a collision in both dimensions
    return horizontalCollision && verticalCollision;
  };

  const handleDragEnd = (event: any) => {
    const hpBar = event.target;
    const hpBarRect = hpBar.getBoundingClientRect();

    // Calculate the middle of the HP bar
    const hpBarMiddleX = (hpBarRect.left + hpBarRect.right) / 2;
    const hpBarMiddleY = (hpBarRect.top + hpBarRect.bottom) / 2;

    let closestEnemy = null;
    let closestDistance = Number.MAX_VALUE;

    enemyRefs.forEach((enemyRef) => {
      if (enemyRef.current) {
        const enemyRect = enemyRef.current.getBoundingClientRect();

        // Calculate the middle of the enemy
        const enemyMiddleX = (enemyRect.left + enemyRect.right) / 2;
        const enemyMiddleY = (enemyRect.top + enemyRect.bottom) / 2;

        // Check if the HP bar's bottom is above the enemy's top
        const verticalCollision =
          hpBarRect.bottom >= enemyRect.top &&
          hpBarRect.top <= enemyRect.bottom;

        if (verticalCollision) {
          // Calculate the distance from the HP bar to the enemy
          const distance = Math.sqrt(
            Math.pow(hpBarMiddleX - enemyMiddleX, 2) +
              Math.pow(hpBarMiddleY - enemyMiddleY, 2)
          );

          if (distance < closestDistance) {
            closestEnemy = enemyRef.current;
            closestDistance = distance;
          }
        }
      }
    });

    if (closestEnemy) {
      // You can perform actions here, e.g., attacking the closest enemy
      console.log("Collision with closest enemy", closestEnemy);
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 100 }}
      whileTap={{ scale: 1.2 }}
      onDragEnd={handleDragEnd}
      style={{ border: "black 2px solid" }}
    >
      HP Bar
    </motion.div>
  );
};

export default HPBar;
