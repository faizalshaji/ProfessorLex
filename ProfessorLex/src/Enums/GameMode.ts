export const GameMode = {
  SinglePlayer: "single-player",
  MultiPlayer: "multi-player",
} as const;

export type GameMode = (typeof GameMode)[keyof typeof GameMode];
