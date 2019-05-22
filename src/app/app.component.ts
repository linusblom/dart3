import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-menu></app-menu>
    <app-notification></app-notification>
    <router-outlet></router-outlet>
  `,
  styles: [':host { display: flex; height: 100vh; }'],
})
export class AppComponent {
  constructor() {}
}
