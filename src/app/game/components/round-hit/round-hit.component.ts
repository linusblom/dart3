import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'game-round-hit',
  templateUrl: './round-hit.component.html',
  styleUrls: ['./round-hit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundHitComponent {
  @Input() value = 0;

  @Input()
  @HostBinding('style.background')
  color = '#daf2dc';
}
