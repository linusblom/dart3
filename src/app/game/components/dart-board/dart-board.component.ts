import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { first, concatMap, delay, finalize } from 'rxjs/operators';
import { timer, from, of } from 'rxjs';

import { Score, JackpotRound, DartHit, DartHitType, Player } from '@game/models';
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
  @Input() jackpot = 0;
  @Input() player: Player;
  @Input() set scores(scores: Score[]) {
    if (!scores.length) {
      this.dartHits = [];
    }
  }

  @Input() set jackpotRound(jackpotRound: JackpotRound) {
    if (jackpotRound) {
      console.log(jackpotRound);
      this.hits = jackpotRound.hits;
      this.currentJackpotRound = 0;
      this.hitsLeft = this.dartHits.map(({ score, multiplier }) => ({ score, multiplier }));
      this.playingJackpot = true;
      this.playJackpotRound();
    }
  }

  @Input()
  @HostBinding('class.locked')
  locked = false;

  @Output() updateScores = new EventEmitter<Score[]>();
  @Output() jackpotGameComplete = new EventEmitter<void>();

  dartHits: DartHit[] = [];
  playingJackpot = false;
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
              .map((_, multiplierIdx) => ({ score: scoreIdx + 1, multiplier: multiplierIdx + 1 })),
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

    if (this.locked || this.dartHits.length === 3) {
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
    if (!this.locked) {
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
      ...Array(removalOrder.length - 30).fill(50),
      ...Array(10).fill(100),
      ...Array(10).fill(200),
      ...Array(4).fill(300),
      ...Array(4).fill(600),
      ...Array(2).fill(1000),
    ];

    from(removalOrder)
      .pipe(
        concatMap((score, index) => of(score).pipe(delay(delayOrder[index]))),
        delay(500),
        finalize(() => {
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
      this.hitsLeft = this.hitsLeft.map((hit, index) =>
        index === isHitIndex ? { score: 0, multiplier: 0 } : hit,
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
        this.playingJackpot = false;
        this.jackpotGameComplete.emit();
      });
  }
}
