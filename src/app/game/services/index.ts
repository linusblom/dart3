import { GameService } from './game.service';
import { PlayerService } from './player.service';
import { HalveItService } from './score/halveit.service';

export { HalveItService } from './score/halveit.service';
export { GameService } from './game.service';
export { PlayerService } from './player.service';

export const services = [HalveItService, GameService, PlayerService];
