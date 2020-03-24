import { Component, Input, HostBinding } from '@angular/core';

const LEVEL_CAP = 10;

@Component({
  selector: 'app-player-stars',
  templateUrl: './player-stars.component.html',
  styleUrls: ['./player-stars.component.scss'],
})
export class PlayerStarsComponent {
  @Input() set xp(xp: number) {
    this.stars = Array(this.getLevel(xp));
  }

  @Input()
  @HostBinding('style.font-size.px')
  size = 16;

  @Input()
  @HostBinding('style.color')
  color = '#d4af37';

  stars = Array(0);

  getLevel(xp: number) {
    for (let level = LEVEL_CAP; level > 0; level--) {
      if (xp > Math.floor(Math.pow(level + (level - 1) * Math.pow(0.001, level), 2) * 10000)) {
        return level;
      }
    }

    return 0;
  }
}
