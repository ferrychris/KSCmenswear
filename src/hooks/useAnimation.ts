import { useEffect, useCallback, useRef } from 'react';
import { AnimationEngine, easings } from '@/lib/animation/engine';

const animationEngine = new AnimationEngine();

export function useAnimation(id: string, options: {
  duration: number;
  easing?: keyof typeof easings;
  ignoreReducedMotion?: boolean;
}) {
  const animationId = useRef(`${id}-${Math.random()}`);

  useEffect(() => {
    animationEngine.register(animationId.current, {
      ...options,
      easing: options.easing ? easings[options.easing] : easings.linear,
    });

    return () => {
      // Cleanup will be handled by the engine
    };
  }, [options]);

  const play = useCallback(() => {
    animationEngine.play(animationId.current);
  }, []);

  const pause = useCallback(() => {
    animationEngine.pause(animationId.current);
  }, []);

  const reset = useCallback(() => {
    animationEngine.reset(animationId.current);
  }, []);

  return {
    play,
    pause,
    reset,
  };
}