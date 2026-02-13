import { useEffect, useRef } from 'react';

// Fix: Initialized useRef with the callback to ensure that `savedCallback.current` is always defined.
// This prevents potential race conditions and makes the hook more robust by removing the initial `undefined` state of the ref.
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
