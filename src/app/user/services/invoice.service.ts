import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Invoice } from 'dart3-sdk';

import { environment } from '@envs/environment';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private apiUrl = `${environment.dart3ApiUrl}/invoice`;

  constructor(private readonly http: HttpClient) {}

  get(paid: boolean) {
    return this.http.get<Invoice[]>(this.apiUrl, { params: { paid: paid ? 'true' : 'false' } });
  }
}
