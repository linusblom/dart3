import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-jackpot',
  templateUrl: './jackpot.component.html',
  styleUrls: ['./jackpot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JackpotComponent {
  @Input() value = 0;
  @Input() set locked(locked: boolean) {
    this.lockedValue = locked ? this.value : 0;
  }

  lockedValue = 0;
}
