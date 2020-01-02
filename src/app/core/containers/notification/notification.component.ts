import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { dismiss } from '@core/actions/notification.actions';
import { Notification } from '@core/models/notification';
import { getAllNotifications, State } from '@root/reducers';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  notifications$: Observable<Notification[]>;

  constructor(private readonly store: Store<State>) {
    this.notifications$ = store.pipe(select(getAllNotifications));
  }

  onDismiss(id: string) {
    this.store.dispatch(dismiss({ id }));
  }
}
