import { HttpErrorResponse } from '@angular/common/http';
import { Action, createAction, props } from '@ngrx/store';
import { User } from 'firebase';

export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: User }>());
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: HttpErrorResponse }>(),
);
export const logout = createAction('[Auth] Logout');

export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{ displayName: string }>(),
);
export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ displayName: string }>(),
);
export const updateProfileFailure = createAction(
  '[Auth] Update Profile Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const updatePassword = createAction(
  '[Auth] Update Password',
  props<{ newPassword: string }>(),
);
export const updatePasswordSuccess = createAction('[Auth] Update Password Success');
export const updatePasswordFailure = createAction(
  '[Auth] Update Password Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const reauthenticate = createAction(
  '[Auth] Reauthenticate',
  props<{ password: string; action: Action }>(),
);
export const reauthenticateSuccess = createAction('[Auth] Reauthenticate Success');
export const reauthenticateFailure = createAction(
  '[Auth] Reauthenticate Failure',
  props<{ error: HttpErrorResponse }>(),
);
