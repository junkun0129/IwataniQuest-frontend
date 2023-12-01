import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../store/store";
import { changeGameMode } from "../store/features/StatesSlice";
import { talkEventEnds } from "../store/features/eventsSlice";

const texts = ["Text 1", "Text 2", "Text 3"];

function useDialog() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const dispatch = useAppDispatch();
  const dialogArray = useAppSelector((state) => state.EventsReducer.dialog);
  const gameMode = useAppSelector((state) => state.StatesReducer.gameMode);
  const isEvent = useAppSelector((state) => state.EventsReducer.isEvent);

  //reset currentText to next sentence
  useEffect(() => {
    if (currentText !== dialogArray[currentIndex]) {
      setCurrentText(dialogArray[currentIndex]);
      setDisplayedText("");
    }
  }, [currentIndex, currentText]);

  //display dialog with timer
  useEffect(() => {
    if (currentText && displayedText.length < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(currentText.substring(0, displayedText.length + 1));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentText, displayedText]);

  useEffect(() => {
    // console.log("oioioioioioioioioioioioi", dialogArray, currentIndex);
  }, [dialogArray]);

  useEffect(() => {
    if (isEvent) {
      setCurrentText(dialogArray[0]);
      setCurrentIndex(0);
      setCurrentText("");
    }
  }, [isEvent]);

  const handleKeyPress = (event) => {
    if (gameMode === "event") {
      if (dialogArray) {
        if (event.key === "e" || event.key === "E") {
          if (currentIndex < dialogArray.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            dispatch(talkEventEnds());
            setCurrentIndex(0);
            setCurrentText("");

            dispatch(changeGameMode("walk"));
          }
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, gameMode]);

  return { displayedText };
}
export default useDialog;
