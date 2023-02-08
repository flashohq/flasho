CREATE_INSERT_EVENT_LOG_FUNCTION = """
    -- FUNCTION: tgf_catalog.insert_event_log(text, text, text, text, json)

    -- DROP FUNCTION IF EXISTS tgf_catalog.insert_event_log(text, text, text, text, json); 

    CREATE OR REPLACE FUNCTION tgf_catalog.insert_event_log(
        schema_name text,
        table_name text,
        trigger_name text,
        op text,
        row_data json)
        RETURNS text
        LANGUAGE 'plpgsql'
        COST 100
        VOLATILE PARALLEL UNSAFE
    AS $BODY$
    DECLARE
        payload json;
    BEGIN
        payload := json_build_object(
            'op', op,
            'data', row_data
        );
        INSERT INTO tgf_catalog.event_logs(schema_name, table_name, trigger_name, payload)
        VALUES(schema_name, table_name, trigger_name, payload);
        RETURN trigger_name;
    END;
    $BODY$;

    ALTER FUNCTION tgf_catalog.insert_event_log(text, text, text, text, json)
        OWNER TO {database};
"""

CREATE_INSERT_TRIGGER_FUNCTION = """
    -- FUNCTION: flasho_{trigger_name}_{event}()

    -- DROP FUNCTION IF EXISTS "flasho_{trigger_name}_{event}"();

    CREATE OR REPLACE FUNCTION tgf_catalog.flasho_{trigger_name}_{event}()
        RETURNS trigger
        LANGUAGE 'plpgsql'
        COST 100
        VOLATILE NOT LEAKPROOF
    AS $BODY$
    DECLARE
        _old record;
        _new record;
        _data json;
    BEGIN
        IF TG_OP = 'UPDATE' THEN
            _old := row(OLD );
            _new := row(NEW );
        ELSE
            /* initialize _old and _new with dummy values for INSERT and UPDATE events*/
            _old := row((select 1));
            _new := row((select 1));
        END IF;
        _data := json_build_object( 
            'old', NULL,
            'new', row_to_json(NEW )
        );
        BEGIN
        IF (TG_OP <> 'UPDATE') OR (_old <> _new) THEN
            PERFORM tgf_catalog.insert_event_log(CAST(TG_TABLE_SCHEMA AS text), CAST(TG_TABLE_NAME AS text), CAST('{trigger_name}' AS text), TG_OP, _data);
        END IF;
        EXCEPTION WHEN undefined_function THEN
            IF (TG_OP <> 'UPDATE') OR (_old *<> _new) THEN
            PERFORM tgf_catalog.insert_event_log(CAST(TG_TABLE_SCHEMA AS text), CAST(TG_TABLE_NAME AS text), CAST('{trigger_name}' AS text), TG_OP, _data);
            END IF;
        END;

        RETURN NULL;
    END;
    $BODY$;

    ALTER FUNCTION tgf_catalog.flasho_{trigger_name}_{event}()
        OWNER TO {database};
"""

CREATE_UPDATE_TRIGGER_FUNCTION = """
    -- FUNCTION: flasho_{trigger_name}_{event}()

    -- DROP FUNCTION IF EXISTS "flasho_{trigger_name}_{event}"();

    CREATE OR REPLACE FUNCTION tgf_catalog.flasho_{trigger_name}_{event}()
        RETURNS trigger
        LANGUAGE 'plpgsql'
        COST 100
        VOLATILE NOT LEAKPROOF
    AS $BODY$
    DECLARE
        _old record;
        _new record;
        _data json;
    BEGIN
        IF TG_OP = 'UPDATE' THEN
            _old := row(OLD );
            _new := row(NEW );
        ELSE
            /* initialize _old and _new with dummy values for INSERT and UPDATE events*/
            _old := row((select 1));
            _new := row((select 1));
        END IF;
        _data := json_build_object( 
            'old', row_to_json(OLD ),
            'new', row_to_json(NEW )
        );
        BEGIN
        IF (TG_OP <> 'UPDATE') OR (_old <> _new) THEN
            PERFORM tgf_catalog.insert_event_log(CAST(TG_TABLE_SCHEMA AS text), CAST(TG_TABLE_NAME AS text), CAST('{trigger_name}' AS text), TG_OP, _data);
        END IF;
        EXCEPTION WHEN undefined_function THEN
            IF (TG_OP <> 'UPDATE') OR (_old *<> _new) THEN
            PERFORM tgf_catalog.insert_event_log(CAST(TG_TABLE_SCHEMA AS text), CAST(TG_TABLE_NAME AS text), CAST('{trigger_name}' AS text), TG_OP, _data);
            END IF;
        END;

        RETURN NULL;
    END;
    $BODY$;

    ALTER FUNCTION tgf_catalog.flasho_{trigger_name}_{event}()
        OWNER TO {database};
"""

CREATE_DELETE_TRIGGER_FUNCTION = """
     -- FUNCTION: flasho_{trigger_name}_{event}()

    -- DROP FUNCTION IF EXISTS "flasho_{trigger_name}_{event}"();

    CREATE OR REPLACE FUNCTION tgf_catalog.flasho_{trigger_name}_{event}()
        RETURNS trigger
        LANGUAGE 'plpgsql'
        COST 100
        VOLATILE NOT LEAKPROOF
    AS $BODY$
    DECLARE
        _old record;
        _new record;
        _data json;
    BEGIN
        IF TG_OP = 'UPDATE' THEN
            _old := row(OLD );
            _new := row(NEW );
        ELSE
            /* initialize _old and _new with dummy values for INSERT and UPDATE events*/
            _old := row((select 1));
            _new := row((select 1));
        END IF;
        _data := json_build_object( 
            'old', row_to_json(OLD ),
            'new', NULL
        );
        BEGIN
        IF (TG_OP <> 'UPDATE') OR (_old <> _new) THEN
            PERFORM tgf_catalog.insert_event_log(CAST(TG_TABLE_SCHEMA AS text), CAST(TG_TABLE_NAME AS text), CAST('{trigger_name}' AS text), TG_OP, _data);
        END IF;
        EXCEPTION WHEN undefined_function THEN
            IF (TG_OP <> 'UPDATE') OR (_old *<> _new) THEN
            PERFORM tgf_catalog.insert_event_log(CAST(TG_TABLE_SCHEMA AS text), CAST(TG_TABLE_NAME AS text), CAST('{trigger_name}' AS text), TG_OP, _data);
            END IF;
        END;

        RETURN NULL;
    END;
    $BODY$;

    ALTER FUNCTION tgf_catalog.flasho_{trigger_name}_{event}()
        OWNER TO {database};
"""
