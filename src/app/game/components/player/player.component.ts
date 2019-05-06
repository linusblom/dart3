import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faGem } from '@fortawesome/free-regular-svg-icons';
import { faBullseye, faCoins } from '@fortawesome/free-solid-svg-icons';

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
    this.cashFormGroup.reset();
  }
  get player() {
    return this._player;
  }

  @Output() updatePlayer = new EventEmitter<Partial<Player>>();
  @Output() updateAvatar = new EventEmitter<File>();

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  cashFormGroup = new FormGroup({
    type: new FormControl(null, Validators.required),
    amount: new FormControl(0, [Validators.required, Validators.min(1)]),
  });
  iconCoins = faCoins;
  iconGem = faGem;
  iconBullseye = faBullseye;

  onUpdatePlayer() {
    if (this.name.valid) {
      this.updatePlayer.emit({ name: this.name.value });
    }
  }
}
