import { Models } from '@rematch/core';
import { credentials } from './credentials';
import { integrations } from './integration';

import { triggers } from './triggers';
import { trigger_drafts } from './triggerDrafts';
import { logs } from './logs';
import { user_table } from './userTable';
import { schemas } from './schemas';
import { tables } from './tables';
import { columns } from './columns';
import { email_templates } from './email_templates';
import { sms_templates } from './sms_template';

export interface RootModel extends Models<RootModel> {
  integrations: typeof integrations;
  logs: typeof logs;
  triggers: typeof triggers;
  trigger_drafts: typeof trigger_drafts;
  user_table: typeof user_table;
  schemas: typeof schemas;
  tables: typeof tables;
  columns: typeof columns;
  credentials: typeof credentials;
  email_templates: typeof email_templates;
  sms_templates: typeof sms_templates;
}

export const models: RootModel = {
  integrations,
  logs,
  triggers,
  trigger_drafts,
  user_table,
  schemas,
  tables,
  columns,
  credentials,
  email_templates,
  sms_templates
};
