import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateGame, Game } from 'dart3-sdk';

import { environment } from '@envs/environment';

@Injectable()
export class GameService {
  private apiUrl = `${environment.dart3ApiUrl}/game`;

  constructor(private readonly http: HttpClient) {}

  create(game: CreateGame) {
    return this.http.post<Game>(this.apiUrl, game);
  }

  getByUid(uid: string) {
    return this.http.get<Game>(`${this.apiUrl}/${uid}`);
  }
}
