import { createModel } from '@rematch/core';
import { RootModel } from '.';
import axiosInstance from '../../utils/axiosInstance';
import { TEMPLATES } from '../types/email_template';
import {
  getEmailTemplates,
  structEmailTemplates
} from '../utils/email_templates';

export const email_templates = createModel<RootModel>()({
  state: { default: {}, user: {}, loading: true } as TEMPLATES, // initial state
  reducers: {
    ADD_USER_EMAIL_TEMPLATE_DRAFT: (state, payload) => {
      const { email_template_id } = payload;
      console.log('in creation');
      console.log(payload);
      const email_template: any = {
        id: email_template_id,
        title: '',
        service_name: '',
        email_column: '',
        language: '',
        table_type: '',
        subject: '',
        user_created: true,
        body_html: '',
        body_design: {},
        body_image: ''
      };
      return {
        ...state,
        user: {
          ...state.user,
          [email_template_id]: email_template
        }
      };
    },
    ADD_USER_EMAIL_TEMPLATE: (state, payload) => {
      const { email_template, email_template_id } = payload;

      return {
        ...state,
        user: {
          ...state.user,
          [email_template_id]: email_template
        }
      };
    },
    UPDATE_EMAIL_TEMPLATE: (state, payload) => {
      const { email_template_id, key, value } = payload;
      return {
        ...state,
        user: {
          ...state.user,
          [email_template_id]: {
            ...state.user[email_template_id],
            [key]: value
          }
        }
      };
    },
    SET_TEMPLATES: (state: TEMPLATES, payload: TEMPLATES) => {
      return { ...state, ...payload };
    },
    SET_LOADING: (state: TEMPLATES, payload: boolean) => {
      return { ...state, loading: payload };
    }
  },
  effects: dispatch => ({
    LOAD_TEMPLATES: async () => {
      dispatch.email_templates.SET_LOADING(true);
      const res = await getEmailTemplates();
      const templates: TEMPLATES = structEmailTemplates(res);
      dispatch.email_templates.SET_TEMPLATES(templates);
      dispatch.email_templates.SET_LOADING(false);
    },
    CREATE_EMAIL_TEMPLATE: async (payload, rootState) => {
      const { email_template_id } = payload;

      const { [email_template_id]: emailTemplate } =
        rootState.email_templates.user;

      dispatch.trigger_drafts.updateValue({
        key: 'creation_status',
        value: 'creating'
      });

      const trigger = rootState.trigger_drafts.current;

      let templateId;

      try {
        let response = await axiosInstance.post('/v1/email/templates', {
          ...emailTemplate,
          title: trigger.name
        });
        const {
          data: { template_id: emailTemplateId }
        } = response;
        templateId = emailTemplateId;
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
        email_template_id: templateId,
        primary_key_column: '',
        configuration: trigger.configuration,
        event: trigger.event,
        foreign_key_column: trigger.foreign_key_column
      };
      try {
        let response = await axiosInstance.post('/v1/triggers/', triggerData);
        console.log(response.data);
        dispatch.trigger_drafts.updateValue({
          key: 'creation_status',
          value: 'success'
        });
      } catch (err) {
        console.log(err);
        dispatch.trigger_drafts.updateValue({
          key: 'creation_status',
          value: 'failed'
        });
      }
    },
    DO_UPDATE_EMAIL_TEMPLATE: async (payload, rootState) => {
      const {
        id,
        email_template_id,
        schema_name,
        table_name,
        configuration,
        event
      } = rootState.trigger_drafts.current;

      console.log({ email_template_id });
      const { [email_template_id as string]: email_template } =
        rootState.email_templates.user;

      console.log({ email_template });
      dispatch.trigger_drafts.updateValue({
        key: 'creation_status',
        value: 'update_in_progress'
      });

      let reqBody = {
        operation: 'update',
        trigger_id: id,
        trigger_configuration: {
          title: email_template.title,
          schema_name: schema_name,
          table_name: table_name,
          configuration: configuration,
          event: event,
          language: email_template.language,
          email_template_id: email_template_id,
          email_service: email_template.service_name,
          email_column: email_template.email_column,
          subject: email_template.subject,
          body_html: email_template.body_html,
          body_design: email_template.body_design
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
