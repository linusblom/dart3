import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  Logout = '[Auth] Logout Redirect',
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
  constructor(public payload: undefined) {}
}

export type AuthActions = Logout;
