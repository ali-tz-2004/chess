import { useState, useEffect } from "react";
import store from "storejs";

function useStoreState<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = store.get(key);
      return storedValue !== undefined ? storedValue : initialValue;
    } catch (error) {
      console.error(`Error reading store key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      store.set(key, state);
    } catch (error) {
      console.error(`Error setting store key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

export default useStoreState;
