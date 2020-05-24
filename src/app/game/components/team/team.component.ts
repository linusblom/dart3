import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import { MatchTeamPlayer } from '@game/models';

@Component({
  selector: 'game-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ transform: 'translateY(-25px)' }),
        animate('300ms ease-in-out', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateY(-25px)' })),
      ]),
    ]),
  ],
})
export class TeamComponent {
  @Input() team: MatchTeamPlayer;
  // roundScores: GameScore[][];
  // gems = 0;

  // trackByFn(_: number, { id }: GameScore) {
  //   return id;
  // }
}
