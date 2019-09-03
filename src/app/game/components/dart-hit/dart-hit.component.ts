import { Component, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { Player, DartHitType } from '@game/models';

@Component({
  selector: 'app-dart-hit',
  templateUrl: './dart-hit.component.html',
  styleUrls: ['./dart-hit.component.scss'],
})
export class DartHitComponent {
  @Input() player: Player;
  @Input() type = DartHitType.AVATAR;
  @Output() remove = new EventEmitter<void>();

  @HostListener('click')
  onClick() {
    this.remove.emit();
  }

  DartHitType = DartHitType;
}
