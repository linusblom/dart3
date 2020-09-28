import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { GameType, Check } from 'dart3-sdk';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { BoardHit, RoundDetails, getBoardScores, CheckOutType, CheckOutScore } from '@game/models';

const ORDER = [20, 16, 12, 8, 18, 19, 25, 4, 10, 15, 11, 9, 6, 5, 17, 14, 13, 7, 2, 3, 1];
const CHECK = {
  [Check.Straight]: {
    min: 1,
    max: 180,
    multipliers: [1, 2, 3],
  },
  [Check.Double]: {
    min: 2,
    max: 170,
    multipliers: [2],
  },
  [Check.Master]: {
    min: 2,
    max: 180,
    multipliers: [2, 3],
  },
};

@Component({
  selector: 'game-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [style({ width: 0 }), animate('100ms ease-out', style({ width: '*' }))]),
      transition(':leave', [style({ width: '*' }), animate('100ms ease-in', style({ width: 0 }))]),
    ]),
  ],
})
export class CheckoutComponent {
  @Input() color = '#ffffff';
  @Input() checkOut = Check.Double;
  @Input() set double(double: number) {
    this.order = [double, ...ORDER];
  }

  roundDetails$ = new BehaviorSubject<RoundDetails>({} as RoundDetails);
  @Input() set roundDetails(details: RoundDetails) {
    this.roundDetails$.next(details);
  }

  override$ = new BehaviorSubject<string[]>(undefined);
  @Input() set override(override: string[]) {
    this.override$.next(override);
  }

  hits$ = new BehaviorSubject<BoardHit[]>([]);
  @Input() set hits(hits: BoardHit[]) {
    this.hits$.next(hits);
  }

  checkouts$ = combineLatest([this.hits$, this.roundDetails$, this.override$]).pipe(
    map(([hits, roundDetails, override]) => override || this.getCheckouts(hits, roundDetails)),
  );

  order = ORDER;
  boardScores = getBoardScores();

  getCheckouts(hits: BoardHit[], details: RoundDetails) {
    switch (details.gameType) {
      case GameType.HalveIt:
        return [
          ['ANY 19'],
          ['ANY 18'],
          ['ANY D'],
          ['ANY 17'],
          ['SUM 41'],
          ['ANY T'],
          ['ANY 20'],
          ['ANY B'],
        ][details.round - 1];
      case GameType.X01:
        return this.getX01Checkouts(hits, details);
      case GameType.Legs:
        return [`BEAT ${details.previousScore}`];
      default:
        return [];
    }
  }

  getX01Checkouts(hits: BoardHit[], details: RoundDetails) {
    const dartsLeft = 3 - hits.length;
    const total =
      details.currentTotal - hits.reduce((tot, hit) => tot + hit.value * hit.multiplier, 0);

    if (details.tieBreak) {
      return ['TIE BREAK', `BEAT ${details.highestScore}`];
    }

    if (total < CHECK[this.checkOut].min || total > CHECK[this.checkOut].max || dartsLeft === 0) {
      return [];
    }

    const counter: number[] = [];
    const checkOutScores: CheckOutScore[][] = [];

    for (counter[0] = 0; counter[0] < this.boardScores.length; ++counter[0]) {
      if (
        this.testThrow(counter, 0, total, checkOutScores) === CheckOutType.Continue &&
        dartsLeft >= 2
      ) {
        for (counter[1] = 0; counter[1] < this.boardScores.length; ++counter[1]) {
          if (
            this.testThrow(counter, 1, total, checkOutScores) === CheckOutType.Continue &&
            dartsLeft === 3
          ) {
            for (counter[2] = 0; counter[2] < this.boardScores.length; ++counter[2]) {
              this.testThrow(counter, 2, total, checkOutScores);
            }
          }
        }
      }
    }

    return checkOutScores
      .sort((a, b) => a.length - b.length)
      .filter((c, _, a) => c.length === a[0].length)
      .sort((a, b) => {
        const indexA = this.order.indexOf(a[a.length - 1].v);
        const indexB = this.order.indexOf(b[b.length - 1].v);

        if (indexA === indexB) {
          if (a[0].m === 1) {
            return 1;
          }

          if (b[0].m === 1) {
            return -1;
          }

          return this.order.indexOf(a[0].v) - this.order.indexOf(b[0].v);
        }

        return indexA - indexB;
      })
      .map((c) => c.map(({ s }) => s))[0];
  }

  testThrow(counter: number[], dart: number, total: number, array: CheckOutScore[][]) {
    let score = 0;
    const checkOutScores: CheckOutScore[] = [];

    for (let i = 0; i <= dart; ++i) {
      const { v, m, s } = this.boardScores[counter[i]];
      score += v * m;
      checkOutScores.push({ v, s, m });

      if (score > total) {
        return CheckOutType.Bust;
      } else if (score === total && CHECK[this.checkOut].multipliers.includes(m)) {
        array.push(checkOutScores);
        return CheckOutType.Done;
      }
    }

    return CheckOutType.Continue;
  }

  trackByFn(_: number, checkOut: string) {
    return checkOut;
  }
}
