import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';

import { Player } from '@game/models';

@Component({
  selector: 'app-start-select-players',
  templateUrl: './start-select-players.component.html',
  styleUrls: ['./start-select-players.component.scss'],
})
export class StartSelectPlayersComponent {
  @Input() players: Player[] = [];
  @Input() loadingPlayers = false;
  @Input() loadingCreatePlayer = false;

  @Output() createPlayer = new EventEmitter<string>();

  iconPlayers = faUsers;
  iconNewPlayer = faUserPlus;
  iconUnchecked = faCircle;
  iconChecked = faCheckCircle;

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);

  onCreatePlayer() {
    this.createPlayer.emit(this.name.value);
    this.name.reset();
  }
}
