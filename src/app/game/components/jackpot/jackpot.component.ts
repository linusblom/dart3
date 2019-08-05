import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-jackpot',
  templateUrl: './jackpot.component.html',
  styleUrls: ['./jackpot.component.scss'],
})
export class JackpotComponent {
  @Input() value = 0;
  @Input() loading = false;
}
