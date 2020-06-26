import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Jackpot } from 'dart3-sdk';

import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root',
})
export class JackpotService {
  private apiUrl = `${environment.dart3ApiUrl}/jackpot`;

  constructor(private readonly http: HttpClient) {}

  getCurrent() {
    return this.http.get<Jackpot>(this.apiUrl);
  }
}
