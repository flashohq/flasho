import { createModel } from '@rematch/core';
import { table } from 'console';
import { RootModel } from '..';
import axiosInstance from '../../../utils/axiosInstance';

interface Column {
  value: string;
  label: string;
}

export interface Columns {
  [key: string]: Column;
}

export const columns = createModel<RootModel>()({
  state: {} as Columns,
  reducers: {
    SET_COLUMNS: (state, payload) => {
      console.log('in reducer', { payload });
      let { columns, table_name, schema_name } = payload;
      columns = columns.map(
        (content: { name: string; data_type: string }, idx: number) => {
          return {
            value: idx,
            label: content.name,
            data_type: content.data_type
          };
        }
      );
      console.log('mapping columns done', { columns });
      return {
        ...state,
        [`${schema_name}$${table_name}`]: columns
      };
    }
  },
  effects: dispatch => ({
    getColumns: async (payload: {
      schema_name: string;
      table_name: string;
    }) => {
      const { schema_name, table_name } = payload;
      console.log({ payload });
      const response = await axiosInstance.get(
        `/v1/triggers/columns/${schema_name}/${table_name}`
      );
      console.log({ response });
      const columns = response.data.columns;
      dispatch.columns.SET_COLUMNS({ columns, table_name, schema_name });
    }
  })
});
