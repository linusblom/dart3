import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { GameScore } from 'dart3-sdk';
import { trigger, transition, style, animate } from '@angular/animations';

import { GamePlayerScore } from '@game/models';

@Component({
  selector: 'game-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
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
export class PlayerComponent {
  @Input() set player(player: GamePlayerScore) {
    this.gameScorePlayer = player;
    this.gems = player.scores.filter(({ gem }) => gem).length;
    this.roundScores = player.scores.reduce((acc, score) => {
      acc[score.round - 1] = [...(acc[score.round - 1] || []), score];
      return acc;
    }, []);
  }

  gameScorePlayer: GamePlayerScore;
  roundScores: GameScore[][];
  gems = 0;

  trackByFn(_: number, { id }: GameScore) {
    return id;
  }
}
