import { useEffect, EffectCallback, DependencyList, useRef } from "react";

export const useNonInitialEffect = (
  func: () => void,
  deps: DependencyList | undefined
) => {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
};
