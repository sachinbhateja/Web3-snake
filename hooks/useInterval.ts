import { useEffect, useRef } from 'react';

// Fix: Simplified and corrected the type for the callback.
// The previous generic type `T extends Function` was too broad and could lead to type errors.
// Since the callback is always called without arguments, `() => void` is the correct and safe type.
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
