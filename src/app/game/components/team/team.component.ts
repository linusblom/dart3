import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { RoundHit, GameType } from 'dart3-sdk';

import { MatchTeamPlayer } from '@game/models';

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
        style({ transform: 'scale(0%)' }),
        animate('300ms linear', style({ transform: 'translateY(-25px)', width: '*' })),
        animate('100ms linear', style({ width: 0 })),
      ]),
    ]),
  ],
})
export class TeamComponent {
  @Input() team: MatchTeamPlayer;
  @Input() type: GameType;
  @Input() jackpotDisabled = true;

  @HostBinding('class.disabled') get disabled() {
    return this.team.position > 1;
  }

  getHitValue(hit: RoundHit) {
    switch (this.type) {
      case GameType.Legs:
        return hit.score;
      default:
        return hit.approvedScore;
    }
  }

  trackByFn(_: number, { round }: RoundHit) {
    return round;
  }
}
