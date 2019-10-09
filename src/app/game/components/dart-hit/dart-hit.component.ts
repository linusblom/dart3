import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { DartHitType, GamePlayer } from '@game/models';
import { DIAMOND } from '@utils/emojis';

@Component({
  selector: 'app-dart-hit',
  templateUrl: './dart-hit.component.html',
  styleUrls: ['./dart-hit.component.scss'],
})
export class DartHitComponent {
  @Input() player: GamePlayer;
  @Input() type = DartHitType.AVATAR;
  @Output() remove = new EventEmitter<void>();

  DartHitType = DartHitType;
  DIAMOND = DIAMOND;

  @HostListener('click')
  onClick() {
    this.remove.emit();
  }
}
