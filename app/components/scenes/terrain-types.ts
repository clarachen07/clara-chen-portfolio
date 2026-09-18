export type TerrainController = {
  ready: Promise<void>;
  setProgress: (progress: number) => void;
  setVisible: (visible: boolean) => void;
  pause: (paused: boolean) => void;
  dispose: () => void;
};
