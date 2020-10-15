import { Component, OnDestroy, HostListener } from '@angular/core';
import { Store, select, Action } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { State, getModal } from '@root/reducers';
import { Modal, ModalAction } from '@core/models';
import { CoreActions } from '@core/actions';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnDestroy {
  modal: Modal;
  pin: string[] = [];

  private readonly destroy$ = new Subject();

  @HostListener('click', ['$event.target'])
  backdropClick(target: HTMLElement) {
    if (target.classList.contains('modal')) {
      this.action(this.modal.backdrop);
    }
  }

  @HostListener('document:keyup', ['$event.key'])
  keyup(key: string) {
    if (key === 'Escape') {
      this.action(this.modal.backdrop);
    } else if (/[0-9]/.test(key) && this.modal.pin) {
      this.addPinNum(key);
    } else if (key === 'Backspace' && this.modal.pin) {
      this.removePinNum();
    } else if (/Enter$/.test(key) && this.pinValid) {
      this.action(this.modal.ok);
    }
  }

  constructor(private readonly store: Store<State>) {
    this.store
      .pipe(
        select(getModal),
        takeUntil(this.destroy$),
        filter((modal) => !!modal),
      )
      .subscribe((modal) => (this.modal = modal));
  }

  get pinValid() {
    return !this.modal.pin || this.pin.length === 4;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  addPinNum(num: string) {
    if (this.pin.length < 4) {
      this.pin.push(num);
    }
  }

  removePinNum() {
    if (this.pin.length > 0) {
      this.pin.pop();
    }
  }

  action(modalAction: ModalAction) {
    this.dispatch(modalAction.action);
    this.dismiss(modalAction.dismiss);
  }

  dismiss(dismiss: boolean) {
    if (dismiss) {
      this.store.dispatch(CoreActions.dismissModal());
    }
  }

  dispatch(action: (pin?: string) => Action) {
    if (action) {
      this.store.dispatch(action(this.pin.join('') || '0000'));
    }
  }
}
