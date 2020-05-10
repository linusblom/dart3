import { CurrentGameService } from './current-game.service';
import { GameService } from './game.service';
import { GameGuard } from './game.guard';

export { CurrentGameService } from './current-game.service';
export { GameService } from './game.service';
export { GameGuard } from './game.guard';

export const services = [CurrentGameService, GameService, GameGuard];
