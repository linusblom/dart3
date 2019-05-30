import { AccountService } from './account.service';
import { AuthGuard } from './auth.guard';

export { AccountService } from './account.service';
export { AuthGuard } from './auth.guard';

export const services = [AccountService, AuthGuard];
