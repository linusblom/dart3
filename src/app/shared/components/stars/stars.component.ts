import { Component, Input, HostBinding } from '@angular/core';

const LEVEL_CAP = 10;

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarsComponent {
  @Input() set xp(xp: number) {
    const { level, progress } = this.getLevel(xp);

    this.nextStartProgress = progress;
    this.stars = Array(level);
  }

  @Input()
  @HostBinding('style.font-size.px')
  size = 16;

  @Input()
  @HostBinding('style.color')
  color = '#949494';

  stars = Array(0);
  nextStartProgress = 0;

  getLevelXp(level: number) {
    return Math.floor(Math.pow(level + (level - 1) * Math.pow(0.001, level), 2) * 10000);
  }

  getLevel(xp: number) {
    for (let level = LEVEL_CAP; level > 0; level--) {
      const levelXp = this.getLevelXp(level);
      if (xp > levelXp) {
        return {
          level,
          progress: Math.round(((xp - levelXp) / (this.getLevelXp(level + 1) - levelXp)) * 100),
        };
      }
    }

    return { level: 0, progress: Math.round((xp / this.getLevelXp(1)) * 100) };
  }
}
