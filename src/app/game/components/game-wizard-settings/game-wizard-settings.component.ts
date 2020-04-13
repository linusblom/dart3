import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GameType, gameName } from 'dart3-sdk';

import { availableBets, availableSets, availableLegs } from '@game/models';

@Component({
  selector: 'app-game-wizard-settings',
  templateUrl: './game-wizard-settings.component.html',
  styleUrls: ['./game-wizard-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameWizardSettingsComponent {
  @Input() variants: GameType[] = [];
  @Input() form: FormGroup;

  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  gameName = gameName;
  bets = availableBets;
  sets = availableSets;
  legs = availableLegs;
}
