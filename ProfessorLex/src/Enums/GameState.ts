export const GameState = {
  Waiting: "waiting",
  Playing: "playing",
  Finished: "finished",
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];
