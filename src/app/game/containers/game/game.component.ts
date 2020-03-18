import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { State } from '@game/reducers';
import { GameTypeSelect } from '@game/models';
import { GameType } from 'dart3-sdk';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  loading$: Observable<boolean>;

  constructor(private readonly store: Store<State>) {}

  games: GameTypeSelect[] = [
    {
      types: [GameType.HalveIt],
      color: '#4056a1',
      name: 'Halve It',
    },
    {
      types: [GameType.Legs],
      color: '#e27d60',
      name: 'Legs',
    },
    {
      types: [GameType.Three01SingleInDoubleOut, GameType.Three01SDoubleInDoubleOut],
      color: '#5cdb95',
      name: '301',
    },
    {
      types: [GameType.Five01SingleInDoubleOut, GameType.Five01DoubleInDoubleOut],
      color: '#557a95',
      name: '501',
    },
  ];

  selectGame(type: GameType) {
    console.log(type);
  }
}
