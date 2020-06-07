import { Component, Input } from '@angular/core';

import { Score } from 'dart3-sdk';

@Component({
  selector: 'game-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent {
  @Input() score: Score;
  @Input() total = false;

  multiplierChars = ['', '', 'D', 'T'];
}
