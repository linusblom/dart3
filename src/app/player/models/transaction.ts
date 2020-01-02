import { TransactionType } from 'dart3-sdk';

export interface TransactionPayload {
  type: TransactionType;
  amount: number;
}
