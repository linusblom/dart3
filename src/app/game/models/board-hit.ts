export interface BoardHit {
  id: string;
  value: number;
  multiplier: number;
  top: number;
  left: number;
  type: BoardHitType;
}

export enum BoardHitType {
  None = 'none',
  Avatar = 'avatar',
  Gem = 'gem',
}
