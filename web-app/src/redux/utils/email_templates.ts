import axiosInstance from '../../utils/axiosInstance';
import { EMAIL_TEMPLATES, TEMPLATE_EMAIL_DATA } from '../types/email_template';

export const getEmailTemplates = async () => {
  const res = await axiosInstance.get('/v1/email/templates/all');
  const templates = await res.data;
  return templates;
};

export const structEmailTemplates = (data: {
  default_templates: Array<TEMPLATE_EMAIL_DATA>;
  user_created_templates: Array<TEMPLATE_EMAIL_DATA>;
}) => {
  let default_templates: EMAIL_TEMPLATES = {};
  for (const content of data.default_templates) {
    default_templates[content['id'] as string] = content;
  }
  let user_templates: EMAIL_TEMPLATES = {};
  for (const content of data.user_created_templates) {
    user_templates[content['id'] as string] = content;
  }

  return { default: default_templates, user: user_templates };
};
