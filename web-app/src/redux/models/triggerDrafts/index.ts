import { createModel } from '@rematch/core';
import { RootModel } from '..';
import axiosInstance from '../../../utils/axiosInstance';
import {
  TriggerDrafts,
  PrimaryVariables,
  DerivedVariables,
  Condition
} from '../../types/triggers';

export const trigger_drafts = createModel<RootModel>()({
  state: {
    triggers: {},
    current: {}
  } as TriggerDrafts,
  reducers: {
    ADD_DRAFT: (
      state,
      payload: {
        id: number | string;
        messageMode: string;
      }
    ) => {
      const { id, messageMode } = payload;

      const trigger = {
        id: id,
        name: '',
        event: '',
        schema_name: '',
        table_name: '',
        configuration: {
          variables: {
            primary: {},
            derived: {},
            manual: []
          },
          conditions: [
            [
              {
                variable_name: '',
                comparator: '',
                condition_value: '',
                logical_operator: ''
              }
            ]
          ]
        },
        sms_template_id: messageMode === 'sms' ? id : '',
        email_template_id: messageMode === 'email' ? id : '',
        foreign_key_column: '',
        isDeleting: false,
        isSubmitting: false,
        creation_status: 'draft',
        activeTab: 'Triggers',
        isEdit: false
      };
      return {
        ...state,
        triggers: {
          ...state.triggers,
          [id]: trigger
        },
        current: trigger
      };
    },

    ADD_EDIT_TO_DRAFT: (state, payload) => {
      const { trigger, activeTab} = payload;

      return {
        ...state,
        current: {
          ...trigger,
          isEdit: true,
          creation_status: 'draft',
          activeTab: activeTab
        }
      };
    },

    REMOVE_CURRENT: state => {
      let data: any = state;
      data.current = {};
      return data;
    },

    updateValue: (state, payload) => {
      console.log({ payload });
      const { key, value } = payload;
      return {
        ...state,
        current: {
          ...state.current,
          [key]: value
        }
      };
    },
    updateVariables: (
      state,
      payload: {
        type: 'primary' | 'derived' | 'manual';
        variables: PrimaryVariables | DerivedVariables | string[];
      }
    ) => {
      const { variables, type } = payload;

      if (type === 'manual' && typeof variables === 'string') {
        return {
          ...state,
          current: {
            ...state.current,
            configuration: {
              ...state.current.configuration,
              variables: {
                ...state?.current?.configuration?.variables,
                manual: variables
              }
            }
          }
        };
      }
      return {
        ...state,
        current: {
          ...state.current,
          configuration: {
            ...state.current.configuration,
            variables: {
              ...state?.current?.configuration?.variables,
              [type]: variables
            }
          }
        }
      };
    },
    updateConditions: (
      state,
      payload: {
        conditions: [[Condition]];
      }
    ) => {
      const { conditions } = payload;
      return {
        ...state,
        current: {
          ...state.current,
          configuration: {
            ...state.current.configuration,
            conditions: conditions
          }
        }
      };
    }
  },
  effects: dispatch => ({
    addDraft: async (
      payload: {
        id: string;
        messageMode: 'email' | 'sms';
        activeTab: string;
      },
      rootState
    ) => {
      const { id, messageMode, activeTab } = payload;
      const { id: currentTriggerId } = rootState.trigger_drafts.current;
      if (currentTriggerId && id === currentTriggerId.toString()) {
        return;
      }
      if (id.startsWith('d')) {
        if (messageMode === 'email') {
          dispatch.email_templates.ADD_USER_EMAIL_TEMPLATE_DRAFT({
            email_template_id: id
          });
        } else if (messageMode === 'sms') {
          dispatch.sms_templates.ADD_SMS_TEMPLATE_DRAFT({
            sms_template_id: id
          });
        } else {
          dispatch.sms_templates.ADD_SMS_TEMPLATE_DRAFT({
            sms_template_id: id
          });
          dispatch.email_templates.ADD_USER_EMAIL_TEMPLATE_DRAFT({
            email_template_id: id
          });
        }
        dispatch.trigger_drafts.ADD_DRAFT({ id, messageMode });
      } else {
        let response = await axiosInstance.get(`/v1/triggers/${id}`);
        const { data } = response;
        const { trigger, email_template, sms_template } = data;

        console.log({ trigger, email_template, sms_template });
        dispatch.trigger_drafts.ADD_EDIT_TO_DRAFT({ trigger, activeTab});

        if (trigger.email_template_id) {
          dispatch.email_templates.ADD_USER_EMAIL_TEMPLATE({
            email_template,
            email_template_id: trigger.email_template_id
          });
        } else {
          dispatch.sms_templates.ADD_SMS_TEMPLATE({
            sms_template,
            sms_template_id: trigger.sms_template_id
          });
        }
      }
    },
    addPrimaryVariables: (payload, rootState) => {
      const { primaryVariablesForm, columnList, userColumnList } = payload;

      const newPrimaryVariables = primaryVariablesForm.reduce(
        (variableArr: any, variableData: any) => {
          return {
            ...variableArr,
            [variableData.variable_name]: {
              table_type: variableData.table_type,
              column_name:
                variableData.table_type === 'trigger_table'
                  ? columnList[variableData.column_index].label
                  : userColumnList[variableData.column_index].label,
              data_type:
                variableData.table_type === 'trigger_table'
                  ? columnList[variableData.column_index].data_type
                  : userColumnList[variableData.column_index].data_type,
              state: variableData.state
            }
          };
        },
        {}
      );

      const oldPrimaryVariables =
        rootState.trigger_drafts.current.configuration.variables.primary;

      let primaryVariables = { ...oldPrimaryVariables, ...newPrimaryVariables };

      dispatch.trigger_drafts.updateVariables({
        variables: primaryVariables,
        type: 'primary'
      });
    },
    addDerivedVariables: (payload, rootState) => {
      const { derivedVariablesForm } = payload;

      console.log({ derivedVariablesForm });
      const { derived: oldDerivedVariables, primary: primaryVariables } =
        rootState.trigger_drafts.current.configuration.variables;

      const newDerivedVariables = derivedVariablesForm.reduce(
        (variableArr: any, variableData: any) => {
          return {
            ...variableArr,
            [variableData.variable_name]: {
              variable1: variableData.variable1,
              variable2: variableData.variable2,
              operation: variableData.operation,
              data_type: primaryVariables[variableData.variable1]
                ? primaryVariables[variableData.variable1].data_type
                : oldDerivedVariables[variableData.variable1].data_type
            }
          };
        },
        {}
      );

      let derivedVariables = { ...oldDerivedVariables, ...newDerivedVariables };

      dispatch.trigger_drafts.updateVariables({
        variables: derivedVariables,
        type: 'derived'
      });
    },
    deleteVariables: (payload, rootState) => {
      const { variables } = payload;
      const { derived: derivedVariables, primary: primaryVariables } =
        rootState.trigger_drafts.current.configuration.variables;

      variables.forEach((variableName: string) => {
        if (derivedVariables[variableName]) {
          let newDerivedVariables = derivedVariables;
          delete newDerivedVariables[variableName];
          dispatch.trigger_drafts.updateVariables({
            variables: newDerivedVariables,
            type: 'derived'
          });
        } else {
          let newPrimaryVariables = primaryVariables;
          delete newPrimaryVariables[variableName];
          dispatch.trigger_drafts.updateVariables({
            variables: newPrimaryVariables,
            type: 'primary'
          });
        }
      });
    },
    addMessageMode: (payload, rootState) => {
      const { id, messageMode } = payload;
      if (messageMode === 'Email') {
        dispatch.trigger_drafts.updateValue({
          key: 'sms_template_id',
          value: ''
        });
        dispatch.trigger_drafts.updateValue({
          key: 'email_template_id',
          value: id
        });
      } else if (messageMode === 'SMS') {
        dispatch.trigger_drafts.updateValue({
          key: 'email_template_id',
          value: ''
        });
        dispatch.trigger_drafts.updateValue({
          key: 'sms_template_id',
          value: id
        });
      }
    }
  })
});
