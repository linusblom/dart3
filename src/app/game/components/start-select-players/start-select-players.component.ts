import { Component, Input } from '@angular/core';
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

import { Player } from '@game/models';

@Component({
  selector: 'app-start-select-players',
  templateUrl: './start-select-players.component.html',
  styleUrls: ['./start-select-players.component.scss'],
})
export class StartSelectPlayersComponent {
  @Input() players: Player[] = [];
  @Input() loadingPlayers = false;

  iconPlayers = faUsers;
  iconUnchecked = faCircle;
  iconChecked = faCheckCircle;
}
