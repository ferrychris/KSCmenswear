import { useEffect, useRef } from 'react';

type CleanupFunction = () => void;

export function useCleanup() {
  const cleanupFns = useRef<Set<CleanupFunction>>(new Set());

  const registerCleanup = (fn: CleanupFunction) => {
    cleanupFns.current.add(fn);
    return () => cleanupFns.current.delete(fn);
  };

  useEffect(() => {
    return () => {
      cleanupFns.current.forEach(fn => fn());
      cleanupFns.current.clear();
    };
  }, []);

  return registerCleanup;
}