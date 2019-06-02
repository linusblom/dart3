import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DartHit, Player } from '@game/models';

@Component({
  selector: 'app-dart-player-turn',
  templateUrl: './dart-player-turn.component.html',
  styleUrls: ['./dart-player-turn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DartPlayerTurnComponent {
  @Input() player: Player;
  @Input() hits: DartHit[] = [];
  @Input() roundText = '-';

  emptyScore = ['empty', 'empty', 'empty'];

  get totalHits() {
    return this.hits.length;
  }

  get totalScore() {
    return this.hits.reduce((total, hit) => (total += hit.score * hit.multiplier), 0);
  }
}
