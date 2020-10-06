import { Component, Input } from '@angular/core';
import { Player, Result } from 'dart3-sdk';

@Component({
  selector: 'game-results-player',
  templateUrl: './results-player.component.html',
  styleUrls: ['./results-player.component.scss'],
})
export class ResultsPlayerComponent {
  @Input() set player({ xp, earnedXp, name, win, avatar }: Player & Result) {
    this.totalXp = xp - earnedXp;
    this.name = name;
    this.earnedXp = earnedXp;
    this.win = win;
    this.avatar = avatar;
  }

  totalXp = 0;
  earnedXp = 0;
  name = '';
  win = 0;
  avatar = '';
}
