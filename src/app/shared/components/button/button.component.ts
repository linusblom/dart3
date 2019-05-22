import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() loading = false;
  @Input() color = 'accent';
  @Input() disabled = false;
  @Output() btnClick = new EventEmitter<void>();
}
