import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GameType, Player } from '@game/models';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreBoardComponent {
  @Input() players: Player[];
  @Input() playerTurn: number;
  @Input() type: GameType;
}
