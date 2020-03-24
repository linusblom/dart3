import { Component } from '@angular/core';
// import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// import { State } from '@game/reducers';
import { availableGames, GameOptionStep } from '@game/models';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  loading$: Observable<boolean>;

  games = availableGames;
  step = GameOptionStep.SelectGame;

  // constructor(private readonly store: Store<State>) {}
}
