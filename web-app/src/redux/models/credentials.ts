import { createModel } from '@rematch/core';
import { RootModel } from '.';
import {
  CREDENTIALS,
  DB_CREDENTIALS,
  PINPOINT_EMAIL_CREDENTIALS,
  PINPOINT_SMS_CREDENTIALS,
  SENDGRID_CREDENTIALS,
  SERVICE_TYPES,
  SES_CREDENTIALS,
  SNS_CREDENTIALS,
  TWILIO_CREDENTIALS
} from '../types/credentials';
import { getCredentials } from '../utils/credentials';

type PAYLOAD_ADD_CREDENTIALS = {
  service_name: SERVICE_TYPES;
  credentials:
    | DB_CREDENTIALS
    | SNS_CREDENTIALS
    | SES_CREDENTIALS
    | PINPOINT_EMAIL_CREDENTIALS
    | PINPOINT_SMS_CREDENTIALS
    | TWILIO_CREDENTIALS
    | SENDGRID_CREDENTIALS;
};

export const credentials = createModel<RootModel>()({
  state: {} as CREDENTIALS, // initial state
  reducers: {
    SET_CREDENTIALS: (state: CREDENTIALS, payload: CREDENTIALS) => {
      return { ...state, ...payload };
    },
    ADD_CREDENTIALS: (state: CREDENTIALS, payload: PAYLOAD_ADD_CREDENTIALS) => {
      let data = state;
      data[payload.service_name] = {
        ...payload.credentials,
        isReconfigure: true
      };
      return data;
    }
  },
  effects: dispatch => ({
    LOAD_CREDENTIALS: async (service_name: string) => {
      const credentials = await getCredentials(service_name);
      console.log('All credentials fetched :', JSON.stringify(credentials));
      dispatch.credentials.SET_CREDENTIALS(credentials);
    }
  })
});
