import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Game, Match, GameType } from 'dart3-sdk';

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

  roundFirstTo(value: number) {
    return Math.ceil(value / 2);
  }

  get gameName() {
    switch (this.game.type) {
      case GameType.X01:
        return this.game.startScore;
      case GameType.HalveIt:
        return 'Halve It';
      case GameType.Legs:
        return 'Legs';
      default:
        return this.game.type;
    }
  }

  get duration() {
    const mills = new Date(this.game.endedAt).getTime() - new Date(this.game.startedAt).getTime();
    const minutes = Math.floor(mills / 60000);
    const seconds = Math.floor((mills % 60000) / 1000);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
}
