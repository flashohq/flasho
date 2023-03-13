export interface INTEGRATIONS {
  db: SERVICE_INTEGRATION[];
  sms: SERVICE_INTEGRATION[];
  email: SERVICE_INTEGRATION[];
}

/*
 * Add new services to both ServiceLabel and
 * SERVICES(to get desired label for frontend)
 */
export interface LABELS {
  postgres: string;
  ses: string;
  sns: string;
  pinpoint: string;
  twilio: string;
  twilio_sendgrid: string;
  message_bird: string
}

export const SERVICES: LABELS = {
  postgres: 'Postgres',
  ses: 'SES',
  sns: 'SNS',
  pinpoint: 'Pinpoint',
  twilio: 'Twilio',
  twilio_sendgrid: 'SendGrid',
  message_bird: "MessageBird"
};

export type SERVICE_INTEGRATION = {
  label: string;
  value: string;
  is_connected: boolean;
  is_active?: boolean;
};
