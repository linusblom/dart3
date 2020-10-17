import {
  Component,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Score, Player, Check, Target } from 'dart3-sdk';

import { BoardHit, BoardHitType, RoundDetails } from '@game/models';
import { generateId } from '@utils/generate-id';

@Component({
  selector: 'game-dart-board',
  templateUrl: './dart-board.component.html',
  styleUrls: ['./dart-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DartBoardComponent {
  @ViewChild('bull', { static: true }) bull: ElementRef;
  @ViewChild('twenty', { static: true }) twenty: ElementRef;

  @Input() player = {} as Player & { matchTeamId: number };
  @Input() teamsCount = 0;
  @Input() color = '#ffffff';
  @Input() timer = -1;
  @Input() jackpotDisabled = false;
  @Input() orderRound = true;
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

  Target = Target;

  hits: BoardHit[] = [];

  addHit(event: MouseEvent, value: number, multiplier: number, target: Target) {
    event.stopPropagation();

    if (
      this.disabled ||
      (this.hits.length === 3 && !this.orderRound) ||
      (this.hits.length === this.teamsCount && this.orderRound)
    ) {
      return;
    }

    const { offsetX, offsetY } = event;
    const bullDistance = this.calculateBullDistance(offsetX, offsetY);

    this.hits = [
      ...this.hits,
      {
        id: generateId(),
        type: BoardHitType.Avatar,
        avatar: this.player.avatar,
        value,
        multiplier,
        top: offsetY - 11,
        left: offsetX - 11,
        matchTeamId: this.player.matchTeamId,
        target,
        bullDistance: value > 0 ? bullDistance : null,
      },
    ];

    this.updateHits();
  }

  calculateBullDistance(hitX: number, hitY: number) {
    const { x, y, width, height } = this.bull.nativeElement.getBoundingClientRect();
    const maxDistance = y + height / 2 - this.twenty.nativeElement.getBoundingClientRect().y;
    const distance = Math.round(
      Math.sqrt(
        Math.pow(Math.abs(x + width / 2 - hitX), 2) + Math.pow(Math.abs(y + height / 2 - hitY), 2),
      ),
    );

    return Math.round((distance / maxDistance) * 1000);
  }

  removeHit(id: string) {
    if (this.disabled || this.orderRound) {
      return;
    }

    this.hits = this.hits.filter((hit) => hit.id !== id);
    this.updateHits();
  }

  updateHits(endRound = false) {
    if (this.disabled) {
      return;
    }

    const scores = this.hits.map(({ value, multiplier, bullDistance, target }) => ({
      value,
      multiplier,
      bullDistance,
      target,
    }));

    if (endRound) {
      this.endRound.emit([
        ...scores,
        ...(this.orderRound
          ? []
          : Array(3)
              .fill({ value: 0, multiplier: 0, bullDistance: -1, target: null })
              .slice(scores.length, 4)),
      ]);
    } else {
      this.updateScores.emit(scores);
    }
  }

  getCheckoutOverride() {
    if (this.disabled) {
      return [];
    }

    if (this.orderRound) {
      return ['NEAREST BULL'];
    }

    return undefined;
  }
}
