import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-score-board-score-field',
  templateUrl: './score-board-score-field.component.html',
  styleUrls: ['./score-board-score-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreBoardScoreFieldComponent {
  @Input() display: string;

  @HostBinding('style.color')
  @Input()
  color = '#FFFFFF';
}
