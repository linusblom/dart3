import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { State } from '@game/reducers';
import { GameActions } from '@game/actions';

@Component({
  selector: 'game-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  constructor(private readonly store: Store<State>, private readonly route: ActivatedRoute) {
    this.store.dispatch(GameActions.getByUidRequest({ uid: this.route.snapshot.params.uid }));
  }
}
