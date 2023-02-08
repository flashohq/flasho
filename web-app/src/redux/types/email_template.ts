export interface EMAIL_TEMPLATES {
  [email_template_id: number | string]: TEMPLATE_EMAIL_DATA;
}

export interface TEMPLATES {
  default: EMAIL_TEMPLATES;
  user: EMAIL_TEMPLATES;
  loading?: boolean;
}

export interface TEMPLATE_EMAIL_DATA {
  id: number | undefined | string;
  title: string;
  service_name: string;
  schema_name: string;
  table_name: string;
  email_column: string;
  table_type: string;
  language: string;
  subject: string;
  user_created: boolean;
  body_html: string;
  body_design: object;
  body_image: string;
}
