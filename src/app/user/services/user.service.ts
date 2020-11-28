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

  update(user: Partial<User>) {
    return this.http.patch<User>(this.apiUrl, user);
  }

  upload(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }
}
