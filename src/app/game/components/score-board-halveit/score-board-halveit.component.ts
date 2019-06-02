import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Player } from '@game/models';

@Component({
  selector: 'app-score-board-halveit',
  templateUrl: './score-board-halveit.component.html',
  styleUrls: ['../score-board/score-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreBoardHalveitComponent {
  @Input() players: Player[];
  @Input() playerTurn: number;

  rounds = ['19', '18', 'D', '17', '41', 'T', '20', 'B'];
}
