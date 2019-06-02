import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  Renderer2,
} from '@angular/core';

import { Score } from '@game/models';
import { generateId } from '@utils/generateId';

interface DartHit extends Score {
  id: string;
  elementRef: HTMLDivElement;
}

@Component({
  selector: 'app-dart-board',
  templateUrl: './dart-board.component.html',
  styleUrls: ['./dart-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DartBoardComponent {
  @Input() set scores(scores: Score[]) {
    if (!scores.length) {
      this.resetHits();
    }
  }

  @Output() scoresChange = new EventEmitter<Score[]>();

  @HostBinding('class.locked')
  @Input()
  locked = false;

  dartHits: DartHit[] = [];

  constructor(private readonly element: ElementRef, private readonly renderer: Renderer2) {}

  boardClick(event: MouseEvent, score: number, multiplier: number) {
    event.stopPropagation();

    if (this.locked || this.dartHits.length === 3) {
      return;
    }

    const { offsetX, offsetY } = event;
    const elementRef = this.renderer.createElement('div');
    const id = generateId();

    this.dartHits = [
      ...this.dartHits,
      {
        id,
        score,
        multiplier,
        elementRef,
      },
    ];

    this.renderer.addClass(elementRef, 'hit');
    this.renderer.setAttribute(elementRef, 'id', id);
    this.renderer.setStyle(elementRef, 'top', `${offsetY - 12}px`);
    this.renderer.setStyle(elementRef, 'left', `${offsetX - 12}px`);
    this.renderer.listen(elementRef, 'click', (e: Event) => {
      this.dartHits = this.dartHits.filter(hit => hit.id !== id);
      this.renderer.removeChild(this.element.nativeElement, e.target);
      this.updateHits();
    });

    this.renderer.appendChild(this.element.nativeElement, elementRef);
    this.updateHits();
  }

  resetHits() {
    this.dartHits.forEach(hit =>
      this.renderer.removeChild(this.element.nativeElement, hit.elementRef),
    );
    this.dartHits = [];
  }

  updateHits() {
    const scores = this.dartHits.map(hit => ({ score: hit.score, multiplier: hit.multiplier }));
    this.scoresChange.emit(scores);
  }
}
