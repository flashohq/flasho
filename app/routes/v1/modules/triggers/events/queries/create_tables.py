CREATE_TABLE_EVENT_TRIGGERS = """
    CREATE TABLE IF NOT EXISTS tgf_catalog.event_triggers(
        id SERIAL PRIMARY KEY,
        name TEXT,
        type TEXT,
        schema_name TEXT,
        table_name TEXT,
        primary_key_column TEXT,
        sms_template_id INTEGER,
        email_template_id INTEGER,
        configuration JSON,
        comment TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        active BOOLEAN DEFAULT true,
        foreign_key_column TEXT
    )
"""

CREATE_TABLE_EVENT_LOGS = "CREATE TABLE IF NOT EXISTS tgf_catalog.event_logs(id SERIAL PRIMARY KEY, trigger_name TEXT, schema_name TEXT, table_name TEXT, payload JSON, response JSON, status TEXT DEFAULT 'PENDING', created_at TIMESTAMPTZ DEFAULT Now(), updated_at TIMESTAMPTZ DEFAULT Now() )"
