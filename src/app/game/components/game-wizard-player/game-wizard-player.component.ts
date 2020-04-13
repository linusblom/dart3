import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Player } from 'dart3-sdk';

@Component({
  selector: 'app-game-wizard-player',
  templateUrl: './game-wizard-player.component.html',
  styleUrls: ['./game-wizard-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameWizardPlayerComponent {
  @Input() player: Player;
}
