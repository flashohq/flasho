import { createModel } from '@rematch/core';
import { RootModel } from '.';
import { TRIGGER_LOGS, TRIGGER_LOG_DETAILS } from '../types/logs';
import { getTriggerLogs, TRIGGER_LOGS_PARARAMS } from '../utils/logs';

export interface LOAD_LOGS_PAYLOAD {
  type: 'sms' | 'email';
  params: TRIGGER_LOGS_PARARAMS;
  isFetching?: boolean;
}

export const logs = createModel<RootModel>()({
  state: {
    sms: { logs: [], count: 0 },
    email: { logs: [], count: 0 },
    loading: true,
    fetchingMore: true
  } as Readonly<TRIGGER_LOGS>, // initial state
  reducers: {
    // handle state changes with pure functions
    SET_LOGS: (state: TRIGGER_LOGS, payload: TRIGGER_LOGS) => {
      return { ...state, ...payload };
    },
    SET_LOADING: (state: TRIGGER_LOGS, payload: boolean) => {
      return { ...state, loading: payload };
    },
    SET_FETCHING: (state: TRIGGER_LOGS, payload: boolean) => {
      return { ...state, fetchingMore: payload };
    }
  },
  effects: dispatch => ({
    LOAD_LOGS: async (payload: LOAD_LOGS_PAYLOAD) => {
      payload.isFetching
        ? dispatch.logs.SET_FETCHING(true)
        : dispatch.logs.SET_LOADING(true);
      const res: TRIGGER_LOG_DETAILS = await getTriggerLogs(
        payload.type,
        payload.params
      );
      dispatch.logs.SET_LOGS({ [`${payload.type}`]: res });
      payload.isFetching
        ? dispatch.logs.SET_FETCHING(false)
        : dispatch.logs.SET_LOADING(false);
    }
  })
});
