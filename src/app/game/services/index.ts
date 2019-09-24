import { GameGuard } from './game.guard';
import { GameResolver } from './game.resolver';
import { GameService } from './game.service';
import { StartGameGuard } from './start-game.guard';

export { GameGuard } from './game.guard';
export { GameResolver } from './game.resolver';
export { GameService } from './game.service';
export { StartGameGuard } from './start-game.guard';

export const services = [GameGuard, GameResolver, GameService, StartGameGuard];
