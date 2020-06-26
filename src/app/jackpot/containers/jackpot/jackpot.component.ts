import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { State } from '@jackpot/reducers/jackpot.reducer';
import { getJackpotValue } from '@root/reducers';

@Component({
  selector: 'jackpot',
  templateUrl: './jackpot.component.html',
  styleUrls: ['./jackpot.component.scss'],
})
export class JackpotComponent {
  value$ = this.store.pipe(select(getJackpotValue));

  constructor(private readonly store: Store<State>) {}
}
