import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'game-dart-board',
  templateUrl: './dart-board.component.html',
  styleUrls: ['./dart-board.component.scss'],
})
export class DartBoardComponent {
  @Input()
  @HostBinding('class.locked')
  locked = false;

  boardClick(event: MouseEvent, score: number, multiplier: number) {
    event.stopPropagation();

    if (this.locked) {
      return;
    }

    console.log(score, multiplier);
  }
}
