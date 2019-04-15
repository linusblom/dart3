import { dismiss, NotificationActionsUnion, push } from '@core/actions/notification.actions';
import { Notification } from '@core/models';
import { generateId } from '@root/utils';

export interface State {
  notifications: Notification[];
}

export const initialState: State = {
  notifications: [],
};

export function reducer(state = initialState, action: NotificationActionsUnion): State {
  switch (action.type) {
    case push.type:
      return {
        notifications: [
          ...state.notifications,
          { id: generateId('notification'), state: action.state, message: action.message },
        ],
      };

    case dismiss.type:
      return {
        notifications: state.notifications.filter(notification => notification.id !== action.id),
      };

    default:
      return state;
  }
}

export const getNotifications = (state: State) => state.notifications;
