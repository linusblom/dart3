import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  HostBinding,
} from '@angular/core';

import { BoardHit, BoardHitType } from '@game/models';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'game-board-hit',
  templateUrl: './board-hit.component.html',
  styleUrls: ['./board-hit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('gem', [
      transition(':enter', [
        style({ transform: 'scale(1)' }),
        animate('500ms ease-out', style({ transform: 'scale(4.0)' })),
        animate('500ms ease-in', style({ transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class BoardHitComponent {
  @Input() hit: BoardHit;
  @Input() avatar = '';

  @Output() remove = new EventEmitter<string>();

  @HostBinding('class') get type() {
    return this.hit.type;
  }

  Type = BoardHitType;
}
