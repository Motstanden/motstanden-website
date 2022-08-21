-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('05_fix_quote_trigger.sql');

DROP TRIGGER trig_quote_updated_at;

CREATE TRIGGER trig_quote_updated_at
    AFTER UPDATE ON quote FOR EACH ROW
BEGIN
    UPDATE quote SET updated_at = current_timestamp
        WHERE quote_id = old.quote_id;
END;
