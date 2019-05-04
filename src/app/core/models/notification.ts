export enum Status {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

export interface Notification {
  id: string;
  status: Status;
  message: string;
}
