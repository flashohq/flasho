import { createModel } from '@rematch/core';
import { RootModel } from '..';
import axiosInstance from '../../../utils/axiosInstance';
import { SMSTemplates } from '../../types/sms_template';

export const sms_templates = createModel<RootModel>()({
  state: {} as SMSTemplates, // initial state
  reducers: {
    ADD_SMS_TEMPLATE_DRAFT: (
      state,
      payload: {
        sms_template_id: number | string;
      }
    ) => {
      const { sms_template_id } = payload;

      return {
        ...state,
        [sms_template_id]: {
          title: '',
          service_name: '',
          schema_name: '',
          table_name: '',
          table_type: '',
          contains_country_code: true,
          country_code_column: '',
          phone_number_column: '',
          type: 'Promotional',
          language: '',
          message_body: ''
        }
      };
    },
    UPDATE_SMS_TEMPLATE: (state, payload) => {
      const { sms_template_id, key, value } = payload;
      return {
        ...state,
        [sms_template_id]: {
          ...state[sms_template_id],
          [key]: value
        }
      };
    },
    ADD_SMS_TEMPLATE: (state, payload) => {
      console.log({ payload });
      const { sms_template, sms_template_id } = payload;

      return {
        ...state,
        [sms_template_id]: sms_template
      };
    },
    SET_TEMPLATES: (state, payload) => {
      return { ...state, ...payload };
    },
    SET_LOADING: (state, payload) => {
      return { ...state, loading: payload };
    }
  },
  effects: dispatch => ({
    CREATE_SMS_TEMPLATE: async (payload, rootState) => {
      const { sms_template_id } = payload;

      const { [sms_template_id]: smsTemplate } = rootState.sms_templates;

      console.log({ smsTemplate });
      dispatch.trigger_drafts.updateValue({
        key: 'creation_status',
        value: 'creating'
      });

      const trigger = rootState.trigger_drafts.current;

      let templateId;

      try {
        let response = await axiosInstance.post('/v1/sms/templates', {
          ...smsTemplate,
          title: trigger.name
        });
        const {
          data: { template_id: smsTemplateId }
        } = response;
        templateId = smsTemplateId;
      } catch (err) {
        console.log(err);
        dispatch.trigger_drafts.updateValue({
          key: 'creation_status',
          value: 'failed'
        });
      }

      const triggerData = {
        trigger_name: trigger.name.replace(/[^A-Z0-9]/gi, '_'),
        schema_name: trigger.schema_name,
        table_name: trigger.table_name,
        sms_template_id: templateId,
        primary_key_column: '',
        configuration: trigger.configuration,
        event: trigger.event,
        foreign_key_column: trigger.foreign_key_column
      };
      try {
        let response = await axiosInstance.post('/v1/triggers/', triggerData);
        dispatch.trigger_drafts.updateValue({
          key: 'creation_status',
          value: 'success'
        });
      } catch (err) {
        dispatch.trigger_drafts.updateValue({
          key: 'creation_status',
          value: 'failed'
        });
      }
    },
    DO_UPDATE_SMS_TEMPLATE: async (payload, rootState) => {
      const {
        id,
        sms_template_id,
        schema_name,
        table_name,
        configuration,
        event
      } = rootState.trigger_drafts.current;

      console.log({ sms_temp_id: sms_template_id });
      const { [sms_template_id as string]: smsTemplate } =
        rootState.sms_templates;

      console.log({ smsTemp: smsTemplate });
      dispatch.trigger_drafts.updateValue({
        key: 'creation_status',
        value: 'update_in_progress'
      });

      let reqBody = {
        operation: 'update',
        trigger_id: id,
        trigger_configuration: {
          title: smsTemplate.title,
          schema_name: '',
          table_name: '',
          primary_key_column: '',
          configuration: configuration,
          event: event,
          sms_template_id: sms_template_id,
          language: smsTemplate.language,
          contains_country_code: smsTemplate.has_country_code,
          country_code_column: smsTemplate.country_code_column,
          phone_number_column: smsTemplate.phone_number_column,
          sms_type: smsTemplate.type,
          message_body: smsTemplate.message_body,
          sms_service: smsTemplate.service_name
        },
        table_name: table_name
      };

      try {
        const response = await axiosInstance.post(
          '/v1/triggers/events',
          reqBody
        );

        dispatch.trigger_drafts.updateValue({
          key: 'creation_status',
          value: 'update_success'
        });
      } catch (err) {
        dispatch.trigger_drafts.updateValue({
          key: 'creation_status',
          value: 'update_failed'
        });
      }
    }
  })
});
