import { Component, Input } from '@angular/core';
import { Player } from 'dart3-sdk';

@Component({
  selector: 'game-dart-player',
  templateUrl: './dart-player.component.html',
  styleUrls: ['./dart-player.component.scss'],
})
export class DartPlayerComponent {
  @Input() player: Player;
}
