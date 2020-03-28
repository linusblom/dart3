import { Component, OnDestroy, HostListener } from '@angular/core';
import { Store, select, Action } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';

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

  confirm = new FormControl('');

  private readonly destroy$ = new Subject();

  @HostListener('click', ['$event.target'])
  backdropClick(target: HTMLElement) {
    if (target.classList.contains('modal')) {
      this.action(this.modal.backdrop);
    }
  }

  constructor(private readonly store: Store<State>) {
    this.store
      .pipe(
        select(getModal),
        takeUntil(this.destroy$),
        filter(modal => !!modal),
      )
      .subscribe(modal => {
        this.modal = modal;

        if (modal.confirm) {
          this.confirm.setValidators([
            Validators.required,
            Validators.pattern(modal.confirm.regexp),
          ]);
          this.confirm.updateValueAndValidity();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
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

  dispatch(action: Action) {
    if (action) {
      this.store.dispatch(action);
    }
  }
}
