import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Score, Player, GameType } from 'dart3-sdk';

import { BoardHit } from '@game/models';
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
  @Input() activeRound = 1;
  @Input() type: GameType;
  @Input() set disabled(disabled: boolean) {
    this._disabled = disabled;

    if (disabled) {
      this.hits = [];
    }
  }

  @Output() updateScores = new EventEmitter<Score[]>();
  @Output() endRound = new EventEmitter<Score[]>();
  @Output() cancel = new EventEmitter<void>();

  @HostBinding('class.disabled') _disabled = false;

  hits: BoardHit[] = [];

  addHit(event: MouseEvent, value: number, multiplier: number) {
    event.stopPropagation();

    if (this._disabled || this.hits.length === 3) {
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
    if (this._disabled) {
      return;
    }

    this.hits = this.hits.filter(hit => hit.id !== id);
    this.updateHits();
  }

  updateHits(endRound = false) {
    if (this._disabled) {
      return;
    }

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
