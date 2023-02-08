import { createModel } from '@rematch/core';
import { RootModel } from '..';
import axiosInstance from '../../../utils/axiosInstance';
import { RootState } from '../../store';

export interface UserTable {
  schema_name: string;
  table_name: string;
  primary_key_column: string;
  isSubmitting: boolean;
  action: string;
}
export const user_table = createModel<RootModel>()({
  state: {} as UserTable,
  reducers: {
    SET_USER_TABLE: (state, payload) => {
      return {
        ...state,
        ...payload
      };
    },
    setValue: (state, payload) => {
      const { key, value } = payload;
      return {
        ...state,
        [key]: value
      };
    }
  },
  effects: dispatch => ({
    getUserTable: async () => {
      const response = await axiosInstance.get('/v1/settings/get_users_table');
      const userTable = response.data.data;
      console.log({ userTable });
      dispatch.user_table.SET_USER_TABLE(userTable);
    },
    setUserTable: async (payload, rootState) => {
      dispatch.user_table.setValue({ key: 'isSubmitting', value: true });
      const { user_table } = rootState;
      const { action, isSubmitting, ...userTablePayload } = user_table;
      const response = await axiosInstance.post(
        '/v1/settings/add_users_table',
        userTablePayload
      );
      dispatch.user_table.setValue({ key: 'isSubmitting', value: false });
      dispatch.user_table.setValue({ key: 'action', value: 'close_modal' });
    }
  })
});
