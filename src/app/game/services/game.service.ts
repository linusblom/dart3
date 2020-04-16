import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CreateGame, Game, GamePlayer } from 'dart3-sdk';

import { environment } from '@envs/environment';

@Injectable()
export class GameService {
  private apiUrl = `${environment.dart3ApiUrl}/game`;

  constructor(private readonly http: HttpClient) {}

  create(game: CreateGame) {
    return this.http.post<Game>(this.apiUrl, game);
  }

  getCurrent() {
    return this.http.get<Game>(`${this.apiUrl}/current`);
  }

  deleteCurrent() {
    return this.http.delete<void>(`${this.apiUrl}/current`);
  }

  createCurrentGamePlayer(playerId: number, pin: string) {
    const headers = new HttpHeaders().append('x-pin', pin);

    return this.http.post<{ players: GamePlayer[] }>(
      `${this.apiUrl}/current/player`,
      { playerId },
      { headers },
    );
  }

  deleteCurrentGamePlayer(playerId: number) {
    return this.http.delete<{ players: GamePlayer[] }>(`${this.apiUrl}/current/player/${playerId}`);
  }
}
