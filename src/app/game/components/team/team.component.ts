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
        animate('300ms ease-in', style({ transform: 'translateY(-25px)', width: '*' })),
        animate('100ms ease-out', style({ width: 0 })),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class TeamComponent {
  @Input() team: MatchTeamPlayer;
  @Input() type: GameType;
  @Input() color = '#ffffff';
  @Input() jackpotDisabled = true;
  @Input() showScore = true;
  @Input() showStart = false;

  @HostBinding('class.disabled') get disabled() {
    return this.team.position > 1;
  }

  getHitValue(hit: RoundHit) {
    switch (this.type) {
      case GameType.Legs:
        return hit.score;
      default:
        return hit.approved;
    }
  }

  trackByFn(_: number, { round }: RoundHit) {
    return round;
  }
}
