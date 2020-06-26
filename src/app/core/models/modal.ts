import { Action } from '@ngrx/store';

export interface Modal {
  header: string;
  text: string;
  backdrop: ModalAction;
  cancel?: ModalAction;
  ok?: ModalAction;
  pin?: boolean;
}

export interface ModalAction {
  dismiss: boolean;
  text?: string;
  color?: string;
  action?: (pin?: string) => Action;
}
