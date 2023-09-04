import { AnimationControls } from "framer-motion";
import { useEffect } from "react";

function useHPBarAnimation(
  control: AnimationControls,
  hp: number,
  maxHp: number
) {
  useEffect(() => {
    control.start({
      width: `${(hp / maxHp) * 100}%`,
    });
  }, [hp]);
}

export default useHPBarAnimation;
