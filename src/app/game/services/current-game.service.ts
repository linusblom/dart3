import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Game, TeamPlayer, Score, MatchResponse, RoundResponse, StartGame } from 'dart3-sdk';

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

  createTeamPlayer(uid: string, pin: string) {
    const headers = new HttpHeaders().append('x-pin', pin);

    return this.http.post<{ players: TeamPlayer[] }>(`${this.apiUrl}/player`, { uid }, { headers });
  }

  deleteTeamPlayer(uid: string) {
    return this.http.delete<{ players: TeamPlayer[] }>(`${this.apiUrl}/player/${uid}`);
  }

  start(payload: StartGame) {
    return this.http.patch<void>(`${this.apiUrl}/start`, payload);
  }

  createRound(scores: Score[]) {
    return this.http.post<RoundResponse>(`${this.apiUrl}/round`, scores);
  }

  getMatches() {
    return this.http.get<MatchResponse>(`${this.apiUrl}/match`);
  }
}
