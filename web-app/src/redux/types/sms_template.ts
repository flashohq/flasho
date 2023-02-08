export interface SMSTemplates {
  [sms_template_id: number | string]: SMSTemplate;
}

export interface SMSTemplate {
  title: string;
  service_name: string;
  schema_name: string;
  table_name: string;
  table_type: string;
  contains_country_code: boolean;
  country_code_column: string;
  phone_number_column: string;
  type: string;
  language: string;
  message_body: string;
  has_country_code?: boolean;
}
