import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@envs/environment';

@Injectable({ providedIn: 'root' })
export class CoreService {
  private apiUrl = `${environment.dart3ApiUrl}`;

  constructor(private readonly http: HttpClient) {}

  getVerifyEmail(uid: string, token: string) {
    return this.http.get<{ email: string }>(`${this.apiUrl}/pub/verify`, {
      params: { uid, token },
    });
  }

  verifyEmail(uid: string, token: string) {
    return this.http.post(`${this.apiUrl}/pub/verify`, { uid, token });
  }
}
