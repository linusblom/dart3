import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Player } from '@game/models';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  private _player: Player;
  @Input() set player(player: Player) {
    this._player = player;
    this.name.setValue(player.name);
  }
  get player() {
    return this._player;
  }

  @Output() updatePlayer = new EventEmitter<Partial<Player>>();
  @Output() updateAvatar = new EventEmitter<File>();

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);

  onUpdatePlayer() {
    if (this.name.valid) {
      this.updatePlayer.emit({ name: this.name.value });
    }
  }
}
