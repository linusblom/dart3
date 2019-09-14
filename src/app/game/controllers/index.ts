import { ControllerService } from './controller.service';
import { DefaultController } from './default.controller';
import { HalveItController } from './halveit.controller';
import { LegsController } from './legs.controller';

export { ControllerService } from './controller.service';

export const controllers = [
  ControllerService,
  DefaultController,
  HalveItController,
  LegsController,
];
