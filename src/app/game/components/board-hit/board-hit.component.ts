import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  HostBinding,
} from '@angular/core';

import { BoardHit, BoardHitType } from '@game/models';

@Component({
  selector: 'game-board-hit',
  templateUrl: './board-hit.component.html',
  styleUrls: ['./board-hit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
