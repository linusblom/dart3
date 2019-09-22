import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { getLevelXP, MAX_LEVEL } from '@utils/level';

@Component({
  selector: 'app-player-level',
  templateUrl: './player-level.component.html',
  styleUrls: ['./player-level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerLevelComponent {
  @Input()
  @HostBinding('style.font-size.px')
  size = 20;

  @Input()
  @HostBinding('style.justify-content')
  justify = 'center';

  @Input() set xp(xp: number) {
    this.stars = Array(this.getLevel(xp)).fill('2B50');
  }

  stars: string[] = [];

  getLevel(xp: number) {
    for (let i = MAX_LEVEL; i > 0; i--) {
      if (xp > getLevelXP(i)) {
        return i;
      }
    }

    return 0;
  }
}
