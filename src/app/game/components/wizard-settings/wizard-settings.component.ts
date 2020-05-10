import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GameType, gameSubName, GameVariant } from 'dart3-sdk';

import { availableBets, availableSets, availableLegs } from '@game/models';

@Component({
  selector: 'game-wizard-settings',
  templateUrl: './wizard-settings.component.html',
  styleUrls: ['./wizard-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardSettingsComponent {
  @Input() types: GameType[] = [];
  @Input() variants: GameVariant[] = [];
  @Input() form: FormGroup;

  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  gameSubName = gameSubName;
  bets = availableBets;
  sets = availableSets;
  legs = availableLegs;
}
