import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
    switch (true) {
      case xp > 100000000:
        return 100;
      case xp > 10000000:
        return Math.round((xp / 1000000) * 100);
      case xp > 1000000:
        return Math.round((xp / 10000000) * 100);
      case xp > 100000:
        return Math.round((xp / 1000000) * 100);
      case xp > 10000:
        return Math.round((xp / 100000) * 100);
      default:
        return Math.round((xp / 10000) * 100);
    }
  }
}
