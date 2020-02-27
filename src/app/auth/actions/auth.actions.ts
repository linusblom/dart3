import { createAction, props } from '@ngrx/store';

import { User } from '@auth/models';

export const loginComplete = createAction('[Auth] Login Complete', props<{ user: User }>());
export const logout = createAction('[Auth] Logout');
