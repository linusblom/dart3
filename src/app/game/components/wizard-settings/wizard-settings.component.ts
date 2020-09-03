import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GameOption } from '@game/models';

@Component({
  selector: 'game-wizard-settings',
  templateUrl: './wizard-settings.component.html',
  styleUrls: ['./wizard-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardSettingsComponent {
  @Input() form: FormGroup;
  @Input() option: GameOption;

  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
}
