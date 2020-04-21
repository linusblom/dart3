import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GameType, gameVariant } from 'dart3-sdk';

import { availableBets, availableSets, availableLegs } from '@game/models';

@Component({
  selector: 'game-wizard-settings',
  templateUrl: './wizard-settings.component.html',
  styleUrls: ['./wizard-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardSettingsComponent {
  @Input() variants: GameType[] = [];
  @Input() form: FormGroup;

  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  gameVariant = gameVariant;
  bets = availableBets;
  sets = availableSets;
  legs = availableLegs;
}
