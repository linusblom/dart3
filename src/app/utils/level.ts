export const MAX_LEVEL = 10;

export const getLevelXP = (level: number) =>
  Math.floor(Math.pow(level + (level - 1) * Math.pow(0.12, level - 1), 4) * 10000);
