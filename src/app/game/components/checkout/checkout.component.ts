import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { GameType } from 'dart3-sdk';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { BoardHit } from '@game/models';

@Component({
  selector: 'game-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('100ms ease-out', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [animate('100ms ease-in', style({ transform: 'translateX(-100%)' }))]),
    ]),
  ],
})
export class CheckoutComponent {
  @Input() type: GameType;
  @Input() color = '#ffffff';

  activeRound$ = new BehaviorSubject<number>(1);
  @Input() set activeRound(activeRound: number) {
    this.activeRound$.next(activeRound);
  }

  disabled$ = new BehaviorSubject<boolean>(false);
  @Input() set disabled(disabled: boolean) {
    this.disabled$.next(disabled);
  }

  hits$ = new BehaviorSubject<BoardHit[]>([]);
  @Input() set hits(hits: BoardHit[]) {
    this.hits$.next(hits);
  }

  checkouts$ = combineLatest([this.hits$, this.activeRound$, this.disabled$]).pipe(
    map(([hits, activeRound, disabled]) =>
      disabled ? [] : this.getPredictions(hits, activeRound),
    ),
  );

  getPredictions(hits: BoardHit[], activeRound: number) {
    switch (this.type) {
      case GameType.HalveIt:
        return this.getHalveItPredictions(hits, activeRound);
      default:
        return [];
    }
  }

  getHalveItPredictions(hits: BoardHit[], activeRound: number) {
    return [
      ['ANY 19'],
      ['ANY 18'],
      ['ANY D'],
      ['ANY 17'],
      ['SUM 41'],
      ['ANY T'],
      ['ANY 20'],
      ['ANY B'],
    ][activeRound - 1];
  }

  trackByFn(index: number) {
    return index;
  }
}
