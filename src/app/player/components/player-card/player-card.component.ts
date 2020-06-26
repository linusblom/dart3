import { Component, Input } from '@angular/core';
import { Player } from 'dart3-sdk';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss'],
})
export class PlayerCardComponent {
  @Input() player: Player;
}
