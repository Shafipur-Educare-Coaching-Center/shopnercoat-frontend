import { ANIMATION_CONFIG } from './config';

export const transitions = {
  gentleSpring: ANIMATION_CONFIG.spring.gentle,
  snappySpring: ANIMATION_CONFIG.spring.snappy,
  smoothTween: {
    type: 'tween' as const,
    ease: ANIMATION_CONFIG.ease.smooth,
    duration: ANIMATION_CONFIG.duration.normal,
  },
};
