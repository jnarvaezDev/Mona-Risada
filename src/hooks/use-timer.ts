import { useEffect, useRef, useState } from "react";

export function useTimer(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now();
    const tick = () => {
      if (startRef.current == null) return;
      setElapsed((performance.now() - startRef.current) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  return elapsed;
}

export function calculatePoints(correct: boolean, seconds: number): number {
  if (!correct) return 0;

  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 10;

  if (safeSeconds >= 10) return 5;

  const normalizedRemainingTime = (10 - safeSeconds) / 10;
  return Math.max(5, Math.ceil(5 + 45 * normalizedRemainingTime ** 2));
}
