export enum SERVICE_TYPES {
  POSTGRES = 'postgres',
  SNS = 'sns',
  SES = 'ses',
  PINPOINT_SMS = 'pinpointsms',
  PINPOINT_EMAIL = 'pinpointemail',
  TWILIO = 'twilio',
  SENDGRID = 'sendgrid',
  MESSAGEBIRD = "messagebird"
}

export interface DB_CREDENTIALS {
  parameter_type: string;
  host: string;
  database: string;
  port: number;
  user: string;
  password: string;
  isReconfigure?: boolean;
}

export interface SNS_CREDENTIALS {
  aws_access_key_id: string;
  aws_secret_access_key: string;
  aws_region: string;
  isReconfigure?: boolean;
}

export interface SES_CREDENTIALS {
  aws_access_key_id: string;
  aws_secret_access_key: string;
  aws_region: string;
  source_email_address: string;
  isReconfigure?: boolean;
}

export interface PINPOINT_SMS_CREDENTIALS {
  aws_access_key_id: string;
  aws_secret_access_key: string;
  aws_region: string;
  pinpoint_application_id: string;
  sender_phone_number: string;
  isReconfigure?: boolean;
}

export interface PINPOINT_EMAIL_CREDENTIALS {
  aws_access_key_id: string;
  aws_secret_access_key: string;
  aws_region: string;
  pinpoint_application_id: string;
  source_email_address: string;
  isReconfigure?: boolean;
}

export interface SENDGRID_CREDENTIALS {
  sendgrid_api_key: string;
  source_email_address: string;
  isReconfigure?: boolean;
}

export interface TWILIO_CREDENTIALS {
  twilio_account_sid: string;
  twilio_auth_token: string;
  twilio_phone_number: string;
  isReconfigure?: boolean;
}

export interface MESSAGEBIRD_CREDENTIALS {
  message_bird_access_key: string
  source_phone_number: string
  isReconfigure?: boolean
}

export interface CREDENTIALS {
  [service_name: string]:
    | DB_CREDENTIALS
    | SNS_CREDENTIALS
    | SES_CREDENTIALS
    | TWILIO_CREDENTIALS
    | SENDGRID_CREDENTIALS
    | PINPOINT_EMAIL_CREDENTIALS
    | PINPOINT_SMS_CREDENTIALS
    | MESSAGEBIRD_CREDENTIALS;
}
