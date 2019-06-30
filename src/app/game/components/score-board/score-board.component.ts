import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { GameConfig, GamePlayer, GameType, Player } from '@game/models';

const emptyGamePlayer: GamePlayer = {
  id: '',
  total: '',
  currentRound: 0,
  out: false,
  rounds: {
    '1': {
      display: '',
      scores: [],
    },
  },
};

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', 'margin-left': -50 }),
        animate('300ms ease-in', style({ transform: 'none', 'margin-left': '*' })),
      ]),
    ]),
  ],
})
export class ScoreBoardComponent implements OnChanges {
  @Input() gamePlayers: GamePlayer[];
  @Input() players: Player[] = [];
  @Input() type: GameType;
  @Input() currentTurn = 0;
  @Input() disableAnimation = false;
  @Input() currentRound = 0;
  @Input() gameConfig: GameConfig;

  rounds: number[] = [];

  GameType = GameType;

  ngOnChanges({ currentRound }: SimpleChanges) {
    if (currentRound && currentRound.currentValue) {
      this.rounds = Array(currentRound.currentValue)
        .fill(0)
        .map((_, index) => index + 1);
    }
  }

  getGamePlayer(playerId: string) {
    return this.gamePlayers.find(({ id }) => id === playerId) || emptyGamePlayer;
  }

  getGamePlayerRound(playerId: string, round: number) {
    const gamePlayer = this.getGamePlayer(playerId);
    return gamePlayer[`${round}`] || emptyGamePlayer.rounds['1'];
  }
}
