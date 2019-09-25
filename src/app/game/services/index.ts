import { GamePlayerService } from './game-player.service';
import { GameGuard } from './game.guard';
import { GameResolver } from './game.resolver';
import { GameService } from './game.service';
import { StartGameGuard } from './start-game.guard';

export { GamePlayerService } from './game-player.service';
export { GameGuard } from './game.guard';
export { GameResolver } from './game.resolver';
export { GameService } from './game.service';
export { StartGameGuard } from './start-game.guard';

export const services = [GamePlayerService, GameGuard, GameResolver, GameService, StartGameGuard];
