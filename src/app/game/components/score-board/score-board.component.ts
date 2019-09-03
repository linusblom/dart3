import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { GameConfig, GamePlayer, Player } from '@game/models';

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
  @Input() gamePlayers: GamePlayer[];
  @Input() players: Player[] = [];
  @Input() currentTurn = 0;
  @Input() disableAnimation = false;
  @Input() currentRound = 0;
  @Input() gameConfig: GameConfig;
  @Input() fullWidth = false;

  rounds: number[] = [];
  roundsPlaceHolder = Array(30).fill(0);

  ngOnChanges({ currentRound }: SimpleChanges) {
    if (currentRound && currentRound.currentValue) {
      this.rounds = Array(currentRound.currentValue)
        .fill(0)
        .map((_, index) => index + 1);
    }
  }

  getGamePlayer(playerId: string) {
    return this.gamePlayers.find(({ id }) => id === playerId) || { rounds: {} };
  }
}
