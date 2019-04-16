import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

import { State } from '@root/app.reducer';
import { logout } from '@root/auth/actions/auth.actions';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('menuAnimation', [
      state('show', style({ transform: 'translateX(0%)' })),
      state('hide', style({ transform: 'translateX(-250px)' })),
      transition('show <=> hide', animate('300ms ease-in-out')),
    ]),
  ],
})
export class MenuComponent {
  menuIcon = faBars;
  expanded = false;

  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLElement) {
    if (this.expanded && !this.element.nativeElement.contains(target)) {
      this.expanded = false;
    }
  }

  constructor(private readonly store: Store<State>, private readonly element: ElementRef) {}

  logoutClick() {
    this.expanded = false;
    this.store.dispatch(logout());
  }
}
