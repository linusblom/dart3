import { Component, Input } from '@angular/core';
import { Player } from 'dart3-sdk';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss'],
})
export class PlayerStatsComponent {
  @Input() player: Player;
}
