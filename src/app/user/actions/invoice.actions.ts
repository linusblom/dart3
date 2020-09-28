import { createAction, props } from '@ngrx/store';
import { Invoice } from 'dart3-sdk';

export const getRequest = createAction('[Invoice] Get Request', props<{ paid: boolean }>());
export const getSuccess = createAction('[Invoice] Get Success', props<{ invoices: Invoice[] }>());
export const getFailure = createAction('[Invoice] Get Failure');
