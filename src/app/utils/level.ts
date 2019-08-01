export const MAX_LEVEL = 10;

export const getLevelScore = (level: number) =>
  Math.floor(Math.pow(level + (level - 1) * Math.pow(0.12, level - 1), 4) * 10000);

export const getLevel = (xp: number) => {
  for (let i = MAX_LEVEL; i > 0; i--) {
    if (xp > getLevelScore(i)) {
      return i;
    }
  }

  return 0;
};
