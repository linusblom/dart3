import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Game, gameName, Match } from 'dart3-sdk';

@Component({
  selector: 'game-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  @Input() game: Game;
  @Input() match: Match;

  @Output() matches = new EventEmitter<void>();

  gameName = gameName;

  roundFirstTo(value: number) {
    return Math.ceil(value / 2);
  }

  get duration() {
    const mills = new Date(this.game.endedAt).getTime() - new Date(this.game.startedAt).getTime();
    const minutes = Math.floor(mills / 60000);
    const seconds = Math.floor((mills % 60000) / 1000);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
}
