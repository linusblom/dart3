import { Component, Input } from '@angular/core';
import { Game, gameName, gameVariant } from 'dart3-sdk';

@Component({
  selector: 'game-dart-overview',
  templateUrl: './dart-overview.component.html',
  styleUrls: ['./dart-overview.component.scss'],
})
export class DartOverviewComponent {
  @Input() game: Game;

  gameName = gameName;
  gameVariant = gameVariant;
}
