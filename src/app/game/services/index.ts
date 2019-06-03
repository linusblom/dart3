import { GameService } from './game.service';
import { HalveItService } from './halveit.service';
import { PlayerService } from './player.service';
import { RoundService } from './round.service';
import { TransactionService } from './transaction.service';

export { HalveItService } from './halveit.service';
export { GameService } from './game.service';
export { PlayerService } from './player.service';
export { RoundService } from './round.service';
export { TransactionService } from './transaction.service';

export const services = [
  HalveItService,
  GameService,
  PlayerService,
  TransactionService,
  RoundService,
];
