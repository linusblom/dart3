import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { from, of, timer } from 'rxjs';
import { concatMap, delay, finalize, first, tap } from 'rxjs/operators';

import { Player } from '@core/models';
import { DartHit, DartHitType, JackpotRound, Score } from '@game/models';
import { generateId } from '@utils/generateId';

enum BoardFieldColor {
  UNUSED = '',
  WHITE = 'white',
  BLACK = 'black',
  BLUE = 'blue',
}

@Component({
  selector: 'app-dart-board',
  templateUrl: './dart-board.component.html',
  styleUrls: ['./dart-board.component.scss'],
})
export class DartBoardComponent {
  @Input() player: Player;
  @Input() playingJackpot = false;
  @Input() set scores(scores: Score[]) {
    if (!scores.length) {
      this.dartHits = [];
    }
  }

  @Input() set jackpotRound(jackpotRound: JackpotRound) {
    if (jackpotRound) {
      this.hits = jackpotRound.hits;
      this.currentJackpotRound = 0;
      this.hitsLeft = this.dartHits.map(({ score, multiplier }) => ({ score, multiplier }));
      this.playJackpotRound();
    }
  }

  @Input()
  @HostBinding('class.disabled')
  disabled = false;

  @HostBinding('class.pulse')
  pulse = false;

  @Output() updateScores = new EventEmitter<Score[]>();
  @Output() jackpotGameComplete = new EventEmitter<void>();

  dartHits: DartHit[] = [];
  currentJackpotRound = 0;
  hitsLeft: Score[] = [];
  hits: Score[] = [];
  boardFieldColors = [];
  winner = false;

  resetAllBoardFieldClasses(boardFieldColor: BoardFieldColor) {
    this.boardFieldColors = Array(26)
      .fill(null)
      .map(() => [BoardFieldColor.UNUSED, boardFieldColor, boardFieldColor, boardFieldColor]);
  }

  getRandomizedBoardFieldScores(last: Score) {
    return [
      ...[
        ...Array(20)
          .fill(null)
          .map((_, scoreIdx) =>
            Array(3)
              .fill(null)
              .map((__, multiplierIdx) => ({ score: scoreIdx + 1, multiplier: multiplierIdx + 1 })),
          )
          .flat(),
        { score: 25, multiplier: 1 },
        { score: 25, multiplier: 2 },
      ]
        .filter(
          ({ score, multiplier }) => !(score === last.score && multiplier === last.multiplier),
        )
        .sort(() => Math.random() - 0.5),
    ];
  }

  boardClick(event: MouseEvent, score: number, multiplier: number) {
    event.stopPropagation();

    if (this.disabled || this.dartHits.length === 3) {
      return;
    }

    const { offsetX, offsetY } = event;

    this.dartHits = [
      ...this.dartHits,
      {
        id: generateId(),
        score,
        multiplier,
        top: offsetY - 12,
        left: offsetX - 12,
        type: DartHitType.AVATAR,
      },
    ];

    this.updateHits();
  }

  removeHit(id: string) {
    if (!this.disabled) {
      this.dartHits = this.dartHits.filter(hit => hit.id !== id);
      this.updateHits();
    }
  }

  updateHits() {
    const scores = this.dartHits.map(hit => ({ score: hit.score, multiplier: hit.multiplier }));
    this.updateScores.emit(scores);
  }

  playJackpotRound() {
    this.resetAllBoardFieldClasses(BoardFieldColor.WHITE);
    this.hitsLeft.forEach(
      ({ score, multiplier }) => (this.boardFieldColors[score][multiplier] = BoardFieldColor.BLUE),
    );

    const removalOrder = this.getRandomizedBoardFieldScores(this.hits[this.currentJackpotRound]);
    const delayOrder = [
      ...Array(removalOrder.length - 10).fill(20),
      ...Array(4).fill(250),
      ...Array(4).fill(500),
      ...Array(1).fill(1000),
      ...Array(1).fill(2000),
    ];

    from(removalOrder)
      .pipe(
        concatMap((score, index) =>
          of(score).pipe(
            delay(delayOrder[index]),
            tap(() => (this.pulse = index === 59)),
          ),
        ),
        delay(500),
        finalize(() => {
          this.pulse = false;
          this.playDelay(() => this.checkJackpotHit(), 500);
        }),
      )
      .subscribe(({ score, multiplier }) => {
        this.boardFieldColors[score][multiplier] = BoardFieldColor.BLACK;
      });
  }

  playDelay(complete: Function, ms = 2000) {
    timer(ms)
      .pipe(first())
      .subscribe(() => complete());
  }

  checkJackpotHit() {
    const hit = this.hits[this.currentJackpotRound];
    const isHitIndex = this.hitsLeft.findIndex(
      ({ score, multiplier }) => score === hit.score && multiplier === hit.multiplier,
    );

    if (isHitIndex >= 0) {
      this.dartHits[isHitIndex].type = DartHitType.DIAMOND;
      this.hitsLeft = this.hitsLeft.map((hitLeft, index) =>
        index === isHitIndex ? { score: 0, multiplier: 0 } : hitLeft,
      );

      if (this.currentJackpotRound++ === 2) {
        this.winner = true;
        this.playDelay(() => this.jackpotWin());
      } else {
        this.playDelay(() => this.playJackpotRound());
      }
    } else {
      this.endJackpotGame();
    }
  }

  jackpotWin() {
    this.resetAllBoardFieldClasses(BoardFieldColor.BLUE);
    this.playDelay(() => this.endJackpotGame());
  }

  endJackpotGame() {
    timer(1000)
      .pipe(first())
      .subscribe(() => {
        this.winner = false;
        this.jackpotGameComplete.emit();
      });
  }
}
