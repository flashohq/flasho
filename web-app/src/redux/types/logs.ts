export interface TRIGGER_LOG_ELEMENT {
  id: number;
  trigger_name: string;
  schema_name: string;
  table_name: string;
  payload: Readonly<object>;
  response: Readonly<object>;
  status:
    | TRIGGER_STATUS.PENDING
    | TRIGGER_STATUS.PROCESSING
    | TRIGGER_STATUS.FAILED
    | TRIGGER_STATUS.PROCESSED;
  created_at: Date;
  updated_at: Date;
}

export enum TRIGGER_STATUS {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED'
}

export interface TRIGGER_LOG_DETAILS {
  logs: TRIGGER_LOG_ELEMENT[];
  count: number;
}

export interface TRIGGER_LOGS {
  sms?: TRIGGER_LOG_DETAILS;
  email?: TRIGGER_LOG_DETAILS;
  loading?: boolean;
  fetchingMore?: boolean;
}
