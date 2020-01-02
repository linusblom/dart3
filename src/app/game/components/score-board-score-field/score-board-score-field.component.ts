import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { Round } from 'dart3-sdk';

@Component({
  selector: 'app-score-board-score-field',
  templateUrl: './score-board-score-field.component.html',
  styleUrls: ['./score-board-score-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreBoardScoreFieldComponent {
  @Input() display: string;

  @Input()
  @HostBinding('style.color')
  color = '#FFFFFF';

  @Input() set round(round: Round) {
    if (round) {
      this.display = round.scoreDisplay;
      this.color = round.color || '#FFFFFF';
    }
  }
}
