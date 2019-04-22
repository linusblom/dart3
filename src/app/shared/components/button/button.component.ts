import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() loading = false;
  @Input() color = 'primary';
  @Input() disabled = false;
  @Output() btnClick = new EventEmitter<void>();

  onClick() {
    if (!this.loading) {
      this.btnClick.emit();
    }
  }
}
