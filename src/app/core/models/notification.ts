export enum NotificationState {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

export interface Notification {
  id: string;
  state: NotificationState;
  message: string;
}
