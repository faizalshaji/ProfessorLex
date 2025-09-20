export const MultiMode = {
  Join: "join",
  Create: "create",
} as const;

export type MultiMode = (typeof MultiMode)[keyof typeof MultiMode];
