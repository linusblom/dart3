import { ControllerService } from './controller.service';
import { DefaultController } from './default.controller';
import { HalveItController } from './halveit.controller';
import { LegsController } from './legs.controller';
import { X01Controller } from './x01.controller';

export { ControllerService } from './controller.service';

export const controllers = [
  ControllerService,
  DefaultController,
  HalveItController,
  LegsController,
  X01Controller,
];
