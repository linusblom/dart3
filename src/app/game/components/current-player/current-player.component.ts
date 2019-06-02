import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Player, Score } from '@game/models';

@Component({
  selector: 'app-current-player',
  templateUrl: './current-player.component.html',
  styleUrls: ['./current-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentPlayerComponent {
  @Input() player: Player;
  @Input() scores: Score[] = [];
  @Input() roundText = '-';
  @Input() disableEndTurn = false;

  @Output() endRound = new EventEmitter<void>();

  emptyScore = ['empty', 'empty', 'empty'];

  get scoresCount() {
    return this.scores.length;
  }

  get totalScore() {
    return this.scores.reduce((total, score) => (total += score.score * score.multiplier), 0);
  }
}
