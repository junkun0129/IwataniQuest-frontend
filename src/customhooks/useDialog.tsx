import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch } from "../store/store";
import { changeGameMode } from "../store/features/StatesSlice";

const texts = ["Text 1", "Text 2", "Text 3"];

function useDialog() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentText !== texts[currentIndex]) {
      setCurrentText(texts[currentIndex]);
      setDisplayedText("");
    }
  }, [currentIndex, currentText]);

  useEffect(() => {
    if (currentText && displayedText.length < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentText.substring(0, displayedText.length + 1));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentText, displayedText]);

  const handleKeyPress = (event) => {
    if (event.key === "e" || event.key === "E") {
      if (currentIndex < texts.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        dispatch(changeGameMode("walk"));
        setCurrentIndex(0); // テキストを最初のものにリセット
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex]);

  return { displayedText };
}
export default useDialog;
