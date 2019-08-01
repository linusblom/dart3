import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { getLevel } from '@utils/level';

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
    this.stars = Array(getLevel(xp)).fill('2B50');
  }

  stars: string[] = [];
}
