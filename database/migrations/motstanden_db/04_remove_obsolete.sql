-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('04_remove_obsolete.sql');

-- Not in use anymore
DROP TABLE ping;