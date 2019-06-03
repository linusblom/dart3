import { Injectable } from '@angular/core';

import { Calculate, Round } from '@game/models';

@Injectable()
export class HalveItService implements Calculate {
  calculate(rounds: Round[]) {
    console.log(rounds);
    return rounds;
  }
}
