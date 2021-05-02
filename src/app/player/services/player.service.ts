import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreatePlayer,
  CreateTransaction,
  Pagination,
  Player,
  PlayerStats,
  Transaction,
  UpdatePlayer,
} from 'dart3-sdk';

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

  getByUid(uid: string) {
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

  disablePin(uid: string, pin: string) {
    return this.http.patch(`${this.apiUrl}/${uid}/disable-pin`, null, { headers: this.pin(pin) });
  }

  createTransaction(uid: string, pin: string, transaction: CreateTransaction) {
    return this.http.post<{ balance: string }>(`${this.apiUrl}/${uid}/transaction`, transaction, {
      headers: this.pin(pin),
    });
  }

  getTransactions(uid: string, limit: number, offset: number) {
    return this.http.get<Pagination<Transaction>>(`${this.apiUrl}/${uid}/transaction`, {
      params: { limit: `${limit}`, offset: `${offset}` },
    });
  }

  getStatistics(uid: string) {
    return this.http.get<PlayerStats>(`${this.apiUrl}/${uid}/statistics`);
  }

  sendEmailVerification(uid: string) {
    return this.http.post(`${this.apiUrl}/${uid}/verify`, null);
  }
}
