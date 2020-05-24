import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Score, Player } from 'dart3-sdk';

import { Hit } from '@game/models';
import { generateId } from '@utils/generate-id';

@Component({
  selector: 'game-dart-board',
  templateUrl: './dart-board.component.html',
  styleUrls: ['./dart-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DartBoardComponent {
  @Input() player = {} as Player;
  @Input() color = '#ffffff';
  @Input() timer = -1;
  @Input() set disabled(disabled: boolean) {
    this._disabled = disabled;

    if (!disabled) {
      this.hits = [];
      this.timer = -1;
    }
  }

  @Output() updateScores = new EventEmitter<Score[]>();
  @Output() endRound = new EventEmitter<Score[]>();
  @Output() cancel = new EventEmitter<void>();

  @HostBinding('class.disabled') _disabled = false;

  hits: Hit[] = [];

  get totalScore() {
    return this.hits.reduce((total, { value, multiplier }) => total + value * multiplier, 0);
  }

  addHit(event: MouseEvent, value: number, multiplier: number) {
    event.stopPropagation();

    if (this.disabled || this.hits.length === 3) {
      return;
    }

    const { offsetX, offsetY } = event;

    this.hits = [
      ...this.hits,
      {
        id: generateId(),
        value,
        multiplier,
        top: offsetY - 11,
        left: offsetX - 11,
      },
    ];

    this.updateHits();
  }

  removeHit(id: string) {
    if (!this.disabled) {
      this.hits = this.hits.filter(hit => hit.id !== id);
      this.updateHits();
    }
  }

  updateHits(endRound = false) {
    const scores = this.hits.map(({ value, multiplier }) => ({ value, multiplier }));

    if (endRound) {
      this.endRound.emit([
        ...scores,
        ...Array(3)
          .fill({ value: 0, multiplier: 0 })
          .slice(scores.length, 4),
      ]);
    } else {
      this.updateScores.emit(scores);
    }
  }
}
