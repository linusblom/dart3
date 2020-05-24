import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Player, CreatePlayer, UpdatePlayer, CreateTransaction, Transaction } from 'dart3-sdk';

import { environment } from '@envs/environment';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private apiUrl = `${environment.dart3ApiUrl}/player`;

  constructor(private readonly http: HttpClient) {}

  private pin(pin: string) {
    return new HttpHeaders().append('x-pin', pin);
  }

  get() {
    return this.http.get<Player[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Player>(`${this.apiUrl}/${id}`);
  }

  create(player: CreatePlayer) {
    return this.http.post<Player>(this.apiUrl, player);
  }

  update(id: number, player: UpdatePlayer) {
    return this.http.put<Player>(`${this.apiUrl}/${id}`, player);
  }

  resetPin(id: number) {
    return this.http.patch(`${this.apiUrl}/${id}/reset-pin`, null);
  }

  delete(id: number, pin: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.pin(pin) });
  }

  deposit(id: number, pin: string, transaction: CreateTransaction) {
    return this.http.post<Transaction>(`${this.apiUrl}/${id}/deposit`, transaction, {
      headers: this.pin(pin),
    });
  }

  withdrawal(id: number, pin: string, transaction: CreateTransaction) {
    return this.http.post<Transaction>(`${this.apiUrl}/${id}/withdrawal`, transaction, {
      headers: this.pin(pin),
    });
  }

  transfer(id: number, pin: string, receiverPlayerId: number, transaction: CreateTransaction) {
    return this.http.post<Transaction>(
      `${this.apiUrl}/${id}/transfer/${receiverPlayerId}`,
      transaction,
      {
        headers: this.pin(pin),
      },
    );
  }
}
