import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { Player } from '@core/models';
import { DartHitType } from '@game/models';

@Component({
  selector: 'app-dart-hit',
  templateUrl: './dart-hit.component.html',
  styleUrls: ['./dart-hit.component.scss'],
})
export class DartHitComponent {
  @Input() player: Player;
  @Input() type = DartHitType.AVATAR;
  @Output() remove = new EventEmitter<void>();

  DartHitType = DartHitType;

  @HostListener('click')
  onClick() {
    this.remove.emit();
  }
}
