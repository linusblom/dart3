import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, union } from '@ngrx/store';
import { User } from 'firebase';

export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: User }>());
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const logout = createAction('[Auth] Logout');

const actions = union({ login, loginSuccess, loginFailure, logout });
export type AuthActionsUnion = typeof actions;
