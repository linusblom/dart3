import { Component, HostBinding } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { trigger, style, transition, animate } from '@angular/animations';
import { tap, delay } from 'rxjs/operators';

import { showLoading, State, showModal, showMenu, showFooter } from './reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('menuLeave', [
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateY(-100px)' })),
      ]),
    ]),
  ],
})
export class AppComponent {
  loading$ = this.store.pipe(select(showLoading));
  showMenu$ = this.store.pipe(
    select(showMenu),
    delay(0),
    tap(padding => (this.padding = padding)),
  );
  showModal$ = this.store.pipe(select(showModal));
  showFooter$ = this.store.pipe(select(showFooter), delay(0));

  @HostBinding('class.padding') padding = false;

  constructor(private readonly store: Store<State>) {}
}
