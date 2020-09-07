import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { timer, interval } from 'rxjs';
import { take, tap, switchMap, takeWhile } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'game-xp-counter',
  templateUrl: './xp-counter.component.html',
  styleUrls: ['./xp-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('scale', [
      transition(':leave', [
        style({ color: ' #39a339', 'font-weight': 'bold' }),
        animate('1500ms linear', style({ transform: 'scale(3.0)', opacity: 0.7 })),
        animate('500ms linear', style({ transform: 'scale(4.0)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class XpCounterComponent implements OnDestroy {
  @Input() totalXp = 0;
  @Input() set addXp(xp: number) {
    this.xp = xp;
    this.showTotal = false;
    this.showAdd = true;
    this.counter$.subscribe();
  }

  @Output() totalXpChange = new EventEmitter<number>();

  showTotal = true;
  showAdd = false;
  xp = 0;

  counter$ = timer(5000).pipe(
    take(1),
    tap(() => {
      this.showTotal = true;
      this.showAdd = false;
    }),
    switchMap(() =>
      interval(1).pipe(
        takeWhile((_, index) => index < this.xp),
        tap(() => this.totalXpChange.emit(this.totalXp + 1)),
      ),
    ),
  );

  ngOnDestroy() {
    this.counter$.subscribe();
  }
}
