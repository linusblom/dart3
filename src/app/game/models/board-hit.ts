import { Target } from 'dart3-sdk';

export interface BoardHit {
  id: string;
  value: number;
  multiplier: number;
  top: number;
  left: number;
  type: BoardHitType;
  avatar: string;
  matchTeamId: number;
  target: Target;
  bullDistance?: number;
}

export enum BoardHitType {
  None = 'none',
  Avatar = 'avatar',
  Gem = 'gem',
}
