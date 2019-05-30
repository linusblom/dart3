import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class GameGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  canActivate() {
    this.router.navigate(['new']);
    return true;
  }
}
