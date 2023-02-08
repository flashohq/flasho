import { createModel } from '@rematch/core';
import { RootModel } from '..';
import axiosInstance from '../../../utils/axiosInstance';

interface Schema {
  value: string;
  label: string;
}

export const schemas = createModel<RootModel>()({
  state: [] as Schema[],
  reducers: {
    SET_SCHEMAS: (state, payload) => {
      let { schemas } = payload;
      schemas = schemas.map((schemaName: string) => {
        return { value: schemaName, label: schemaName };
      });
      return schemas;
    }
  },
  effects: dispatch => ({
    getSchemaList: async () => {
      const response = await axiosInstance.get(`/v1/triggers/schemas`);
      const schemas = response.data.schemas;
      if (schemas.includes('public')) {
        let indexFound = schemas.indexOf('public');
        schemas.splice(indexFound, 1);
        schemas.unshift('public');
      }
      dispatch.schemas.SET_SCHEMAS({ schemas });
    }
  })
});
