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

  getById(uid: string) {
    return this.http.get<Player>(`${this.apiUrl}/${uid}`);
  }

  create(player: CreatePlayer) {
    return this.http.post<Player>(this.apiUrl, player);
  }

  update(uid: string, player: UpdatePlayer) {
    return this.http.put<Player>(`${this.apiUrl}/${uid}`, player);
  }

  resetPin(uid: string) {
    return this.http.patch(`${this.apiUrl}/${uid}/reset-pin`, null);
  }

  delete(uid: string, pin: string) {
    return this.http.delete(`${this.apiUrl}/${uid}`, { headers: this.pin(pin) });
  }

  deposit(uid: string, pin: string, transaction: CreateTransaction) {
    return this.http.post<Transaction>(`${this.apiUrl}/${uid}/deposit`, transaction, {
      headers: this.pin(pin),
    });
  }

  withdrawal(uid: string, pin: string, transaction: CreateTransaction) {
    return this.http.post<Transaction>(`${this.apiUrl}/${uid}/withdrawal`, transaction, {
      headers: this.pin(pin),
    });
  }

  transfer(uid: string, pin: string, receiverUid: string, transaction: CreateTransaction) {
    return this.http.post<Transaction>(
      `${this.apiUrl}/${uid}/transfer/${receiverUid}`,
      transaction,
      {
        headers: this.pin(pin),
      },
    );
  }
}
