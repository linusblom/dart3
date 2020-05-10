import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Hit } from '@game/models';

@Component({
  selector: 'game-board-hit',
  templateUrl: './board-hit.component.html',
  styleUrls: ['./board-hit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardHitComponent {
  @Input() hit: Hit;
  @Input() avatar = '';

  @Output() remove = new EventEmitter<string>();
}
