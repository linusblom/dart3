import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { getLevelScore, MAX_LEVEL } from '@utils/level';

@Component({
  selector: 'app-player-level-progress',
  templateUrl: './player-level-progress.component.html',
  styleUrls: ['./player-level-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerLevelProgressComponent {
  @Input() set xp(xp: number) {
    this.progress = this.getProgress(xp);
  }

  progress = 0;

  getProgress(xp: number) {
    for (let i = MAX_LEVEL; i > 0; i--) {
      const currentLevelScore = getLevelScore(i);
      if (xp > currentLevelScore) {
        const nextLevelScore = getLevelScore(i + 1);

        console.log(nextLevelScore, currentLevelScore);

        return Math.round(((xp - currentLevelScore) / (nextLevelScore - currentLevelScore)) * 100);
      }
    }

    return Math.round((xp / getLevelScore(1)) * 100);
  }
}
