-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('08_rumours.sql');

ALTER TABLE quote
RENAME COLUMN user_id TO  created_by;
