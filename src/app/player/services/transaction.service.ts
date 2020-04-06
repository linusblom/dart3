import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TransactionPayload, Transaction } from 'dart3-sdk';

import { environment } from '@envs/environment';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = `${environment.dart3ApiUrl}/transaction`;

  constructor(private readonly http: HttpClient) {}

  bankToPlayer(playerId: number, pin: string, transaction: TransactionPayload) {
    const headers = new HttpHeaders().append('x-pin', pin);

    return this.http.post<Transaction>(`${this.apiUrl}/${playerId}`, transaction, { headers });
  }

  playerToPlayer(
    playerId: number,
    pin: string,
    toPlayerId: number,
    transaction: TransactionPayload,
  ) {
    const headers = new HttpHeaders().append('x-pin', pin);

    return this.http.post<Transaction>(
      `${this.apiUrl}/${playerId}/player/${toPlayerId}`,
      transaction,
      { headers },
    );
  }
}
