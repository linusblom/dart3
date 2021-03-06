import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { pluck, shareReplay } from 'rxjs/operators';

import { CoreActions } from '@core/actions';
import { getBanner, State } from '@root/reducers';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  animations: [
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-200%)' }),
        animate('250ms linear', style({ transform: 'translateX(-20%)' })),
        animate('2000ms linear', style({ transform: 'translateX(0)' })),
        animate('2000ms linear', style({ transform: 'translateX(20%)' })),
        animate('250ms linear', style({ transform: 'translateX(200%)' })),
      ]),
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(200%)' }),
        animate('250ms linear', style({ transform: 'translateX(20%)' })),
        animate('2000ms linear', style({ transform: 'translateX(0)' })),
        animate('2000ms linear', style({ transform: 'translateX(-20%)' })),
        animate('250ms linear', style({ transform: 'translateX(-200%)' })),
      ]),
    ]),
  ],
})
export class BannerComponent {
  banner$ = this.store.pipe(select(getBanner), shareReplay(1));
  header$ = this.banner$.pipe(pluck('header'));
  subHeader$ = this.banner$.pipe(pluck('subHeader'));
  text$ = this.banner$.pipe(pluck('text'), shareReplay(1));
  color$ = this.banner$.pipe(pluck('color'));

  done = 0;

  constructor(private readonly store: Store<State>) {}

  animationDone() {
    this.done++;

    if (this.done === 2) {
      this.store.dispatch(CoreActions.dismissBanner());
    }
  }
}
