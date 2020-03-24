import { Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { HttpClient } from '@angular/common/http';
import { Player, CreatePlayer } from 'dart3-sdk';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private apiUrl = `${environment.apiUrl}/player`;

  constructor(private readonly http: HttpClient) {}

  get() {
    return this.http.get<Player[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Player>(`${this.apiUrl}/${id}`);
  }

  create(player: CreatePlayer) {
    return this.http.post<Player>(this.apiUrl, player);
  }
}
