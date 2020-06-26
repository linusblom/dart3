import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Player } from 'dart3-sdk';

@Component({
  selector: 'game-wizard-player',
  templateUrl: './wizard-player.component.html',
  styleUrls: ['./wizard-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardPlayerComponent {
  @Input() player: Player;
}
