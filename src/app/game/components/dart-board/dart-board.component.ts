import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Score, Player, Check } from 'dart3-sdk';

import { BoardHit, BoardHitType, RoundDetails } from '@game/models';
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
  @Input() jackpotDisabled = false;
  @Input() roundDetails = {} as RoundDetails;
  @Input() checkOut = Check.Double;
  @Input() set gems(gems: boolean[]) {
    if (gems.length) {
      this.hits = this.hits.map((hit, index) => ({
        ...hit,
        type: gems[index] ? BoardHitType.Gem : BoardHitType.None,
      }));
    }
  }
  @Input() set clear(clear: boolean) {
    if (clear) {
      this.hits = [];
    }
  }

  @Output() updateScores = new EventEmitter<Score[]>();
  @Output() endRound = new EventEmitter<Score[]>();
  @Output() cancel = new EventEmitter<void>();

  @Input()
  @HostBinding('class.disabled')
  disabled = false;

  hits: BoardHit[] = [];

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
        type: BoardHitType.Avatar,
        value,
        multiplier,
        top: offsetY - 11,
        left: offsetX - 11,
      },
    ];

    this.updateHits();
  }

  removeHit(id: string) {
    if (this.disabled) {
      return;
    }

    this.hits = this.hits.filter((hit) => hit.id !== id);
    this.updateHits();
  }

  updateHits(endRound = false) {
    if (this.disabled) {
      return;
    }

    const scores = this.hits.map(({ value, multiplier }) => ({ value, multiplier }));

    if (endRound) {
      this.endRound.emit([
        ...scores,
        ...Array(3).fill({ value: 0, multiplier: 0 }).slice(scores.length, 4),
      ]);
    } else {
      this.updateScores.emit(scores);
    }
  }
}
