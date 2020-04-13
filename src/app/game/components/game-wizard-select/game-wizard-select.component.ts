import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-game-wizard-select',
  templateUrl: './game-wizard-select.component.html',
  styleUrls: ['./game-wizard-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameWizardSelectComponent {
  @Input() description = '';

  @Output() next = new EventEmitter<void>();
}
