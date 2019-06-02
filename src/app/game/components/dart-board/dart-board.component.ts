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

import { DartHit } from '@game/models';
import { generateId } from '@utils/generateId';

@Component({
  selector: 'app-dart-board',
  templateUrl: './dart-board.component.html',
  styleUrls: ['./dart-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DartBoardComponent {
  @HostBinding('class.locked')
  @Input()
  locked = false;

  @Output() hits = new EventEmitter<DartHit[]>();

  dartHits: DartHit[] = [];

  constructor(private readonly element: ElementRef, private readonly renderer: Renderer2) {}

  boardClick(event: MouseEvent, score: number, multiplier: number) {
    event.stopPropagation();

    if (this.locked || this.dartHits.length === 3) {
      return;
    }

    const { offsetX, offsetY } = event;
    const dartHitRef = this.renderer.createElement('div');
    const id = generateId();

    const dartHit = {
      id,
      score,
      multiplier,
    };

    this.dartHits = [...this.dartHits, dartHit];

    this.renderer.addClass(dartHitRef, 'hit');
    this.renderer.setAttribute(dartHitRef, 'id', id);
    this.renderer.setStyle(dartHitRef, 'top', `${offsetY - 12}px`);
    this.renderer.setStyle(dartHitRef, 'left', `${offsetX - 12}px`);
    this.renderer.listen(dartHitRef, 'click', (e: Event) => {
      this.dartHits = this.dartHits.filter(hit => hit.id !== id);
      this.renderer.removeChild(this.element.nativeElement, e.target);
      this.hits.emit(this.dartHits);
    });

    this.renderer.appendChild(this.element.nativeElement, dartHitRef);
    this.hits.emit(this.dartHits);
  }
}
