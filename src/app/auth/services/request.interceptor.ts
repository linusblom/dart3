import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, first } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private readonly auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth.accessToken$.pipe(
      first(),
      concatMap(accessToken => {
        request = request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });

        return next.handle(request);
      }),
    );
  }
}
