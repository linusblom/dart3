import { Component, Input } from '@angular/core';
import { PlayerState } from '@player/reducers/player.reducer';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss'],
})
export class PlayerStatsComponent {
  @Input() player: PlayerState;
}
