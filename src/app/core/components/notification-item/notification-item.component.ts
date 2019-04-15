import { animate, sequence, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { timer } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

import { Notification } from '@core/models';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss'],
  animations: [
    trigger('notificationAnimation', [
      transition('void => *', [
        style({ opacity: '0', transform: 'translateX(400px)' }),
        animate('300ms ease-in', style({ opacity: '1', transform: 'none' })),
      ]),

      transition('* => void', [
        style({ height: '*', marginBottom: '*', opacity: '1', transform: 'none' }),
        sequence([
          animate('300ms ease-out', style({ opacity: '0', transform: 'translateX(400px)' })),
          animate('100ms ease-out', style({ height: '0', marginBottom: '0' })),
        ]),
      ]),
    ]),
  ],
})
export class NotificationItemComponent {
  @Input() notification: Notification;

  @Output() dismiss = new EventEmitter<string>();

  show = true;
  icon = {
    error: faExclamationCircle,
    warning: faExclamationTriangle,
    info: faInfoCircle,
    success: faCheckCircle,
  };

  constructor() {
    timer(10000)
      .pipe(
        tap(() => (this.show = false)),
        delay(500),
      )
      .subscribe(() => this.dismiss.emit(this.notification.id));
  }
}
