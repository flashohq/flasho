import { createContext, useContext, useReducer, useState } from 'react';
import Notification from './Notification';

const NotificationContext = createContext<any>('');

const createID = () => {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

const NotificationProvider = (props: any) => {
  const [state, dispatch] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case 'ADD_NOTIFICATION':
        return [...state, { ...action.payload }];
      case 'REMOVE_NOTIFICATION':
        return state.filter((el: any) => el.id !== action.id);
      default:
        return state;
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      <div className={'notification-wrapper'}>
        {state.map((note: any) => {
          return <Notification dispatch={dispatch} key={note.id} {...note} />;
        })}
      </div>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const { state, dispatch } = useContext(NotificationContext);

  const notification = (props: any) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: props.id ? props.id : createID(),
        ...props
      }
    });
  };

  notification.isActive = (notificationID: any) => {
    return state.some((note: any) => note.id === notificationID);
  };

  return notification;
};

export default NotificationProvider;
