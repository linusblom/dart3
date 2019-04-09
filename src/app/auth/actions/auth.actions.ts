import { createAction, union } from '@ngrx/store';

export const logout = createAction('[Auth] Logout');

const actions = union({ logout });
export type AuthActionsUnion = typeof actions;
