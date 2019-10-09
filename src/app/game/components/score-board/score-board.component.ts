import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { GamePlayer, GameType } from '@game/models';

const roundHeaders = {
  [GameType.HALVEIT]: (round: number) => ['19', '18', 'D', '17', '41', 'T', '20', 'B'][round - 1],
  [GameType.LEGS]: (round: number) => `${round}`,
};

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', 'margin-left': -51 }),
        animate('300ms ease-in-out', style({ transform: 'none', 'margin-left': '*' })),
      ]),
    ]),
  ],
})
export class ScoreBoardComponent implements OnChanges {
  @Input() type = GameType.HALVEIT;
  @Input() players: GamePlayer[];
  @Input() currentTurn = 0;
  @Input() disableAnimation = false;
  @Input() disablePosition = false;
  @Input() currentRound = 0;
  @Input() fullWidth = false;

  rounds: number[] = [];

  ngOnChanges({ currentRound }: SimpleChanges) {
    if (currentRound && currentRound.currentValue) {
      this.rounds = Array(currentRound.currentValue)
        .fill(0)
        .map((_, index) => index + 1);
    }
  }

  getRoundHeader(round: number) {
    return roundHeaders[this.type](round);
  }

  trackByFn(index: number) {
    return index;
  }
}
