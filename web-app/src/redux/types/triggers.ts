export interface Triggers {
  sms: HashMapTriggers;
  email: HashMapTriggers;
  loading: boolean;
}

export interface HashMapTriggers {
  [trigger_id: number | string]: Trigger;
}

export interface TriggerDrafts {
  triggers: HashMapTriggers;
  current: Trigger;
}

export interface Trigger {
  id: number | string;
  name: string;
  event: string;
  schema_name: string;
  table_name: string;
  configuration: TriggerConfiguration;
  sms_template_id?: string | number;
  email_template_id?: string | number;
  foreign_key_column?: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  isDeleting?: boolean;
  creation_status?: string;
  activeTab?: string;
  isEdit?: boolean;
}

interface TriggerConfiguration {
  variables: {
    primary: PrimaryVariables;
    derived: DerivedVariables;
    manual: string[]
  };
  conditions: Array<Array<Condition>>;
}

export interface PrimaryVariables {
  [variable_name: string]: {
    table_type: string;
    column_name: string;
    data_type: string;
    state: string;
  };
}

export interface DerivedVariables {
  [variable_name: string]: {
    variable1: string;
    variable2: string;
    operation: string;
    data_type: string;
  };
}

export interface Condition {
  variable_name: string;
  comparator: string;
  condition_value: string | number;
  logical_operator: string;
}
