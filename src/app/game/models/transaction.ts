export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  balance: number;
  timestamp: number;
}

export enum TransactionType {
  BET = 'bet',
  WIN = 'win',
  JACKPOT = 'jackpot',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
}

export interface TransactionPayload {
  type: TransactionType;
  amount: number;
}
