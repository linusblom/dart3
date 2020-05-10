import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Game, gameName, gameSubName } from 'dart3-sdk';

@Component({
  selector: 'game-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  @Input() game: Game;

  gameName = gameName;
  gameSubName = gameSubName;
}
