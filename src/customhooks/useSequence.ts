import { useState } from "react";

const useSequence = () => {
  const [battleState, setBattleState] = useState(0); // 0: Not started, 1: In progress, 2: Ended
  const [turn, setTurn] = useState("user"); // "user" or "enemy"

  // Functions to manage turn state
  const setUserTurn = () => setTurn("user");
  const setEnemyTurn = () => setTurn("enemy");

  // Define functions for handling battle sequences and changing battle state
  const startBattle = () => {
    // Change the battle state to "in progress"
    setBattleState(1);

    // Initialize turn to "user" (user starts)
    setUserTurn();

    // Add logic to initiate your battle sequence here
  };

  const endBattle = () => {
    // Change the battle state to "ended"
    setBattleState(2);

    // Reset turn to "user"
    setUserTurn();

    // Add logic to handle the end of the battle here
  };

  const userTurnAction = () => {
    // Add logic for user's turn here
    // Example: handle user attacks

    // Switch to enemy's turn
    setEnemyTurn();
  };

  const enemyTurnAction = () => {
    // Add logic for enemy's turn here
    // Example: handle enemy attacks

    // Switch to user's turn
    setUserTurn();
  };

  return {
    battleState,
    turn,
    startBattle,
    endBattle,
    userTurnAction,
    enemyTurnAction,
  };
};

export default useSequence;
