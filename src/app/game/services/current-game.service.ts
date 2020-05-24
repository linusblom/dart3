import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Game, TeamPlayer, Score, ScoreResponse, Match } from 'dart3-sdk';

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

  createTeamPlayer(playerId: number, pin: string) {
    const headers = new HttpHeaders().append('x-pin', pin);

    return this.http.post<{ players: TeamPlayer[] }>(
      `${this.apiUrl}/player`,
      { playerId },
      { headers },
    );
  }

  deleteTeamPlayer(playerId: number) {
    return this.http.delete<{ players: TeamPlayer[] }>(`${this.apiUrl}/player/${playerId}`);
  }

  start() {
    return this.http.patch<void>(`${this.apiUrl}/start`, null);
  }

  createRound(scores: Score[]) {
    return this.http.post<ScoreResponse>(`${this.apiUrl}/round`, scores);
  }

  getMatches() {
    return this.http.get<Match[]>(`${this.apiUrl}/match`);
  }
}
