import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
} from '@angular/core';

import { DartHit } from '@game/models';
import { generateId } from '@utils/generateId';

@Component({
  selector: 'app-dart-board',
  templateUrl: './dart-board.component.html',
  styleUrls: ['./dart-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DartBoardComponent {
  @Output() hits = new EventEmitter<DartHit[]>();

  dartHits: DartHit[] = [];

  constructor(private readonly element: ElementRef, private readonly renderer: Renderer2) {}

  boardClick(event: MouseEvent, score: number, multiplier: number) {
    event.stopPropagation();

    const { offsetX, offsetY } = event;
    const dartImgRef = this.renderer.createElement('div');
    const id = generateId();

    const dartHit = {
      id,
      score,
      multiplier,
    };

    this.dartHits = [...this.dartHits, dartHit];

    this.renderer.addClass(dartImgRef, 'hit');
    this.renderer.setAttribute(dartImgRef, 'id', id);
    this.renderer.setStyle(dartImgRef, 'top', `${offsetY - 12}px`);
    this.renderer.setStyle(dartImgRef, 'left', `${offsetX - 12}px`);
    this.renderer.listen(dartImgRef, 'click', (e: Event) => {
      this.dartHits = this.dartHits.filter(hit => hit.id !== id);
      this.renderer.removeChild(this.element.nativeElement, e.target);
      this.hits.emit(this.dartHits);
    });

    this.renderer.appendChild(this.element.nativeElement, dartImgRef);
    this.hits.emit(this.dartHits);
  }
}
