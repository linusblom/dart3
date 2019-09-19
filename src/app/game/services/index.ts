import { GameGuard } from './game.guard';
import { GameService } from './game.service';
import { StartGameGuard } from './start-game.guard';

export { GameGuard } from './game.guard';
export { GameService } from './game.service';
export { StartGameGuard } from './start-game.guard';

export const services = [GameGuard, GameService, StartGameGuard];
