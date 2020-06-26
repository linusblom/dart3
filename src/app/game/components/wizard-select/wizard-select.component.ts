import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'game-wizard-select',
  templateUrl: './wizard-select.component.html',
  styleUrls: ['./wizard-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardSelectComponent {
  @Input() description = '';

  @Output() next = new EventEmitter<void>();
}
