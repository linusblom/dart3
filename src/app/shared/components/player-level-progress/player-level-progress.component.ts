import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { getLevelXP, MAX_LEVEL } from '@utils/level';

@Component({
  selector: 'app-player-level-progress',
  templateUrl: './player-level-progress.component.html',
  styleUrls: ['./player-level-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerLevelProgressComponent {
  @Input() set xp(xp: number) {
    this.progress = this.getProgress(xp);
    this.currentXP = xp;
  }

  progress = 0;
  currentXP = 0;
  nextLevelXP = 0;

  getProgress(xp: number) {
    for (let i = MAX_LEVEL; i > 0; i--) {
      const currentLevelXP = getLevelXP(i);
      if (xp > currentLevelXP) {
        const nextLevelXP = getLevelXP(i + 1);
        this.nextLevelXP = nextLevelXP;

        return Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);
      }
    }

    this.nextLevelXP = 10000;
    return Math.round((xp / getLevelXP(1)) * 100);
  }
}
