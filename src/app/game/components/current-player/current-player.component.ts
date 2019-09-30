import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { GamePlayer, Score } from '@game/models';

@Component({
  selector: 'app-current-player',
  templateUrl: './current-player.component.html',
  styleUrls: ['./current-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentPlayerComponent {
  @Input() player: GamePlayer;
  @Input() scores: Score[] = [];
  @Input() disableEndTurn = false;
  @Input() countDown = -1;
  @Input() turnText = '-';

  @Output() endTurn = new EventEmitter<void>();
  @Output() abortAutoEndTurn = new EventEmitter<void>();

  emptyScores = ['empty', 'empty', 'empty'];

  get scoresCount() {
    return this.scores.length;
  }

  get totalScore() {
    return this.scores.reduce((total, score) => (total += score.score * score.multiplier), 0);
  }

  get endTurnButtonText() {
    return this.countDown >= 0 ? `End Turn (${this.countDown})` : 'End Turn';
  }
}
