import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-jackpot',
  templateUrl: './jackpot.component.html',
  styleUrls: ['./jackpot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JackpotComponent {
  @Input() set jackpot(value: number) {
    this.value = value;

    if (!this.locked) {
      this.lockedValue = value;
    }
  }
  @Input() locked = false;
  @Input() winner = false;

  value = 0;
  lockedValue = 0;

  get displayValue() {
    return this.locked ? this.lockedValue : this.value;
  }
}
