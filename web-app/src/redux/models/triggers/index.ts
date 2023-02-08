import { createModel } from '@rematch/core';
import { RootModel } from '..';
import axiosInstance from '../../../utils/axiosInstance';
import { Triggers, Trigger } from '../../types/triggers';

export const triggers = createModel<RootModel>()({
  state: {
    sms: {},
    email: {},
    loading: false
  } as Triggers,
  reducers: {
    set_triggers: (
      state,
      payload: {
        triggers: Trigger[];
        type: 'email' | 'sms';
      }
    ) => {
      const { triggers, type } = payload;
      return {
        ...state,
        loading: false,
        [type]: triggers
      };
    },
    delete_trigger: (
      state,
      payload: {
        id: number;
        type: 'email' | 'sms';
      }
    ) => {
      const { id, type } = payload;
      const triggerCopy = state[type];
      delete triggerCopy[id];
      return {
        ...state,
        [type]: triggerCopy
      };
    },
    alter_trigger: (
      state,
      payload: {
        id: number;
        type: 'email' | 'sms';
      }
    ) => {
      const { id, type } = payload;
      console.log();
      return {
        ...state,
        [type]: {
          ...state[type],
          [id]: {
            ...state[type][id],
            active: !state[type][id].active
          }
        }
      };
    },
    set_loading: (state, payload) => {
      return {
        ...state,
        loading: payload
      };
    },
    set_isDeleting: (
      state,
      payload: {
        id: number;
        type: 'email' | 'sms';
      }
    ) => {
      const { id, type } = payload;
      state[type][id]['isDeleting'] = true;
      return {
        ...state,
        [type]: {
          ...state[type],
          [id]: {
            ...state[type][id],
            isDeleting: true
          }
        }
      };
    }
  },
  effects: dispatch => ({
    get_triggers: async (type: 'email' | 'sms') => {
      console.log({ type });
      dispatch.triggers.set_loading(true);
      const response = await axiosInstance.get(`/v1/triggers/events/${type}`);
      const triggers = response.data?.triggers;
      console.log({ triggers });
      dispatch.triggers.set_triggers({ triggers, type });
    },
    remove_trigger: async (payload: { id: number; type: 'email' | 'sms' }) => {
      const { id } = payload;
      dispatch.triggers.set_isDeleting(payload);
      const response = await axiosInstance.delete('/v1/triggers/events', {
        data: { id: id }
      });
      dispatch.triggers.delete_trigger(payload);
    },
    alter: async (payload: {
      id: number;
      type: 'email' | 'sms';
      data: object;
    }) => {
      const { id, type, data } = payload;
      const response = await axiosInstance.post('/v1/triggers/events', data);
      dispatch.triggers.alter_trigger({ id, type });
    }
  })
});
