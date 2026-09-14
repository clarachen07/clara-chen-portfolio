export type MarsAction =
  | "left"
  | "right"
  | "up"
  | "down"
  | "closer"
  | "farther"
  | "reset";

export type MarsController = {
  ready: Promise<void>;
  action: (action: MarsAction) => void;
  pause: (paused: boolean) => void;
  dispose: () => void;
};
