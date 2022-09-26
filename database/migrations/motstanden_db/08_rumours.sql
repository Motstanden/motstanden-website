-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('08_rumours.sql');

ALTER TABLE quote
RENAME COLUMN user_id TO  created_by;

CREATE TABLE rumour (
    rumour_id INTEGER PRIMARY KEY NOT NULL,
    rumour TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TRIGGER trig_rumour_updated_at
    AFTER UPDATE ON rumour FOR EACH ROW
BEGIN
    UPDATE rumour SET updated_at = current_timestamp
        WHERE rumour_id = old.rumour_id;
END;
