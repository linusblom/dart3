export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  balance: number;
  timestamp: number;
}

export enum TransactionType {
  GAME_BET = 'game bet',
  JACKPOT_BET = 'jackpot bet',
  GAME_WIN = 'game win',
  JACKPOT_WIN = 'jackpot win',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
}

export interface TransactionPayload {
  type: TransactionType;
  amount: number;
}
