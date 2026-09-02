export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    page: 0.4,
  },
  ease: {
    smooth: [0.25, 0.46, 0.45, 0.94] as const,
    bounce: [0.34, 1.56, 0.64, 1] as const,
    sharp: [0.4, 0, 0.2, 1] as const,
  },
  stagger: {
    list: 0.07,
    cards: 0.1,
  },
  spring: {
    gentle: { type: 'spring' as const, stiffness: 120, damping: 20 },
    snappy: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
};
