import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Game, GamePlayer, Score, ScoreResponse } from 'dart3-sdk';

import { environment } from '@envs/environment';

@Injectable()
export class CurrentGameService {
  private apiUrl = `${environment.dart3ApiUrl}/game/current`;

  constructor(private readonly http: HttpClient) {}

  get() {
    return this.http.get<Game>(this.apiUrl);
  }

  delete() {
    return this.http.delete<void>(this.apiUrl);
  }

  createGamePlayer(playerId: number, pin: string) {
    const headers = new HttpHeaders().append('x-pin', pin);

    return this.http.post<{ players: GamePlayer[] }>(
      `${this.apiUrl}/player`,
      { playerId },
      { headers },
    );
  }

  deleteGamePlayer(playerId: number) {
    return this.http.delete<{ players: GamePlayer[] }>(`${this.apiUrl}/player/${playerId}`);
  }

  start() {
    return this.http.patch<void>(`${this.apiUrl}/start`, null);
  }

  submitRound(scores: Score[]) {
    return this.http.post<ScoreResponse>(`${this.apiUrl}/round`, { scores });
  }
}
