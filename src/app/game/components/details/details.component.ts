import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Game, gameName, gameSubName, Match } from 'dart3-sdk';

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
  gameSubName = gameSubName;
}
