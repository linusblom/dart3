import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dart-board',
  templateUrl: './dart-board.component.html',
  styleUrls: ['./dart-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DartBoardComponent {
  boardClick(event: MouseEvent, score: number, multiplier: number) {
    console.log(event, score, multiplier);
  }
}
