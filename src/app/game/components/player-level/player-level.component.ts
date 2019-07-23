import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-level',
  templateUrl: './player-level.component.html',
  styleUrls: ['./player-level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerLevelComponent {
  @Input() size = 20;
  @Input() set xp(xp: number) {
    this.stars = this.getStars(xp);
  }

  stars: string[] = [];

  getStars(xp: number) {
    switch (true) {
      case xp > 100000000:
        return Array(5).fill('2B50');
      case xp > 10000000:
        return Array(4).fill('2B50');
      case xp > 1000000:
        return Array(3).fill('2B50');
      case xp > 100000:
        return Array(2).fill('2B50');
      case xp > 10000:
        return Array(1).fill('2B50');
    }
  }
}
