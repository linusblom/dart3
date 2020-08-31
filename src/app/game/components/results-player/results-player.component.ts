import { Component, Input } from '@angular/core';
import { Player, Result } from 'dart3-sdk';

@Component({
  selector: 'game-results-player',
  templateUrl: './results-player.component.html',
  styleUrls: ['./results-player.component.scss'],
})
export class ResultsPlayerComponent {
  @Input() player = {} as Player & Result;
  @Input() countXp = false;
}
