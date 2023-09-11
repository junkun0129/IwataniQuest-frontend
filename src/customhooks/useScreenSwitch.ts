import { useEffect } from "react";
import { socketType } from "../gamecompo/Field";
import { useAnimationControls } from "framer-motion";

const useScreenSwitch = ({ socket }: socketType) => {
  const fieldControl = useAnimationControls();
  const battleControl = useAnimationControls();
  useEffect(() => {
    socket.on("screenSwitch", async (data) => {
      console.log("entounttttttttttt");
      await fieldControl.start({
        scale: [1, 2, 0.5, 0.5, 3, 1, 0.5],
        rotate: [0, 50, 20, 30, 20, 0, 0],
        x: [0, 0, 0, 0, 0, 0, 0, 0, -300, 1500],
        transition: { duration: 2 },
      });

      await battleControl.start({
        x: [-1600, 400, 0, 0, 0],
        scale: [0.7, 0.7, 0.7, 0.4, 1],
        transition: { duration: 2 },
      });

      await socket.emit("encount", "encounted");
    });

    socket.on("backSwitch", async (data) => {
      console.log("modoruzooo");

      if (data === "backback") {
        await battleControl.start({
          x: [0, 0, 0, 400, -1600],
          scale: [1, 0.7, 0.7, 0.4, 0.7],
          transition: { duration: 2 },
        });
        await fieldControl.start({
          scale: [0.5, 2, 0.5, 0.5, 3, 1, 1],
          rotate: [0, 50, 20, 30, 20, 0, 0],
          x: [1500, 300, 0, 0, 0, 0, 0, 0, 0, 0],
          transition: { duration: 2 },
        });

        await socket.emit("back", "backbackdone");
      }
    });

    socket.on("lose", async (data) => {
      if (data === "toReact") {
        await battleControl.start({
          x: [0, 0, 0, 400, -1600],
          scale: [1, 0.7, 0.7, 0.4, 0.7],
          transition: { duration: 2 },
        });
        await fieldControl.start({
          scale: [0.5, 2, 0.5, 0.5, 3, 1, 1],
          rotate: [0, 50, 20, 30, 20, 0, 0],
          x: [1500, 300, 0, 0, 0, 0, 0, 0, 0, 0],
          transition: { duration: 2 },
        });
      }
    });
  }, [socket]);
  return { fieldControl, battleControl };
};

export default useScreenSwitch;
