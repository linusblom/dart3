import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'dart3-sdk';

import { environment } from '@envs/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.dart3ApiUrl}/user`;

  constructor(private readonly http: HttpClient) {}

  get() {
    return this.http.get<User>(this.apiUrl);
  }
}
