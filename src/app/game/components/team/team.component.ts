import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { RoundHit, GameType } from 'dart3-sdk';

import { MatchTeamPlayer } from '@game/models';

const RED = '#f2dada';
const GREEN = '#daf2dc';

@Component({
  selector: 'game-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-25px)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('300ms ease-in', style({ transform: 'translateY(-25px)' })),
      ]),
    ]),
  ],
})
export class TeamComponent {
  @Input() team: MatchTeamPlayer;
  @Input() type: GameType;
  @Input() jackpotDisabled = true;

  getHitValue(hit: RoundHit) {
    switch (this.type) {
      case GameType.HalveIt:
      default:
        return hit.approvedScore;
    }
  }

  getHitColor(hit: RoundHit) {
    switch (this.type) {
      case GameType.HalveIt:
      default:
        return hit.approvedScore > 0 ? GREEN : RED;
    }
  }

  trackByFn(_: number, { round }: RoundHit) {
    return round;
  }
}
