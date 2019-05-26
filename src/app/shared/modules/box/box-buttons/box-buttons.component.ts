import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-box-buttons',
  templateUrl: './box-buttons.component.html',
  styleUrls: ['./box-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxButtonsComponent {
  @Input() leftText = '';
  @Input() leftLoading = false;
  @Input() leftDisabled = false;
  @Input() rightText = '';
  @Input() rightLoading = false;
  @Input() rightDisabled = false;

  @Output() leftClick = new EventEmitter<void>();
  @Output() rightClick = new EventEmitter<void>();

  onLeftClick() {
    if (!this.leftLoading && !this.leftDisabled) {
      this.leftClick.emit();
    }
  }

  onRightClick() {
    if (!this.rightLoading && !this.rightDisabled) {
      this.rightClick.emit();
    }
  }
}
