import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { GameType, Player, Round } from '@game/models';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreBoardComponent {
  @Input() players: Player[] = [];
  @Input() type: GameType;
  @Input() currentTurn = 0;
  @Input() currentRound = 0;
  @Input() loading = false;
  @Input() rounds: Round[];

  GameType = GameType;
}
