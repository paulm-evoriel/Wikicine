DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT c.relname AS table_name, a.attname AS column_name, s.relname AS sequence_name
        FROM pg_class c
        JOIN pg_attribute a ON a.attrelid = c.oid
        JOIN pg_depend d ON d.refobjid = c.oid AND d.refobjsubid = a.attnum
        JOIN pg_class s ON s.oid = d.objid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'r'
          AND a.attnum > 0
          AND d.deptype = 'a'
          AND n.nspname = 'public'
    LOOP
        EXECUTE format(
            'SELECT setval(''%I'', COALESCE((SELECT MAX(%I) FROM %I), 1))',
            r.sequence_name, r.column_name, r.table_name
        );
    END LOOP;
END$$; 