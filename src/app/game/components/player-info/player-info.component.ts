import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faGem } from '@fortawesome/free-regular-svg-icons';
import { faBullseye, faCoins } from '@fortawesome/free-solid-svg-icons';

import { Player } from '@game/models';

@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerInfoComponent {
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
  iconCoins = faCoins;
  iconGem = faGem;
  iconBullseye = faBullseye;

  onUpdatePlayer() {
    if (this.name.valid) {
      this.updatePlayer.emit({ name: this.name.value });
    }
  }
}
