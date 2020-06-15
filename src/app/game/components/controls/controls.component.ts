import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'game-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent {
  @Input() timer = -1;
  @Input() color = '#ffffff';

  @Output() endRound = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
