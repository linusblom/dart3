import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from 'dart3-sdk';

import { environment } from '@envs/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private apiUrl = `${environment.dart3ApiUrl}/account`;

  constructor(private readonly http: HttpClient) {}

  get() {
    return this.http.get<Account>(this.apiUrl);
  }
}
