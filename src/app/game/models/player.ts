import { Transaction } from './transaction';

export interface Player {
  id: string;
  name: string;
  credits: number;
  xp: number;
  created: number;
  avatarUrl: string;
  color: string;
  diamonds: number;
  played: number;
  wins: number;
  lost: number;
  hits: number;
  misses: number;
  highest: number;
  oneHundredEighties: number;
  turnover: number;
  net: number;
  transactions: Transaction[];
}
