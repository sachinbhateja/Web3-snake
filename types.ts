
export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export type Coords = {
  x: number;
  y: number;
};

export type LeaderboardEntry = {
  score: number;
  date: string;
};

export type TxStatus = 'idle' | 'pending' | 'success' | 'error';
