import { createModel } from '@rematch/core';
import { RootModel } from '.';
import { INTEGRATIONS } from '../types/integration';
import { getIntegrationList } from '../utils/integrations';
import axiosInstance from '../../utils/axiosInstance';
import { useNotification } from '../../Notifications/NotificationProvider';

export const integrations = createModel<RootModel>()({
  state: { db: [], email: [], sms: [] } as INTEGRATIONS, // initial state
  reducers: {
    SET_CONFIG: (state: INTEGRATIONS, payload: INTEGRATIONS) => {
      return { ...state, ...payload };
    }
  },
  effects: dispatch => ({
    LOAD_CONFIG: async () => {
      console.log('here123');
      const integrationList = await getIntegrationList();
      console.log({ integrationList });
      dispatch.integrations.SET_CONFIG(integrationList);
    },
    DELETE_INTEGRATION: async (service_name: string) => {
      await axiosInstance
        .delete(`/v1/settings/delete_integration/${service_name}`)
        .then(res => {
          console.log(res);
          dispatch.integrations.LOAD_CONFIG();
        })
        .catch(e => {
          console.log('Error Delete', e);
        });
    },
    TOGGLE_INTEGRATION: async (service_name: string) => {
      await axiosInstance
        .post(`/v1/settings/toggle_activation/${service_name}`)
        .then(res => {
          console.log(res);
          dispatch.integrations.LOAD_CONFIG();
        })
        .catch(e => {
          console.log('Error Toggle', e);
        });
    }
  })
});
