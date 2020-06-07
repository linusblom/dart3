import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Player, Score } from 'dart3-sdk';

import { BoardHit } from '@game/models';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'game-current-player',
  templateUrl: './current-player.component.html',
  styleUrls: ['./current-player.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('200ms ease-in-out', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        style({ height: '*', transform: 'translateX(0%)' }),
        animate('200ms ease-in-out', style({ transform: 'translateX(-100%)' })),
        animate('200ms ease-in-out', style({ height: '0' })),
      ]),
    ]),
  ],
})
export class CurrentPlayerComponent {
  @Input() player: Player;
  @Input() timer = -1;
  @Input() set hits(hits: BoardHit[]) {
    this.scores = hits.map(({ id, value, multiplier }) => ({ id, value, multiplier }));
    this.total = {
      multiplier: 0,
      value: hits.reduce((acc, { value, multiplier }) => acc + value * multiplier, 0),
    };
  }

  @Output() endRound = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  scores: (Score & { id: string })[];
  total: Score;

  trackByFn(_: number, { id }: Score & { id: string }) {
    return id;
  }
}
