-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('14_simple_text.sql');

CREATE TABLE simple_text(
    simple_text_id INTEGER PRIMARY KEY NOT NULL,
    key TEXT NOT NULL UNIQUE COLLATE NOCASE,
    text TEXT NOT NULL,

    updated_by INTEGER NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(updated_by)
        REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TRIGGER trig_simple_text_updated_at
    AFTER UPDATE ON simple_text FOR EACH ROW
BEGIN
    UPDATE simple_text SET updated_at = current_timestamp
        WHERE simple_text_id = old.simple_text_id;
END;
