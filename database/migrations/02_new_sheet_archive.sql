-- ::::::::::::::::::::::::::
--      database version
-- ::::::::::::::::::::::::::

CREATE TABLE version (
    version_id INTEGER PRIMARY KEY NOT NULL,
    migration TEXT,
    create_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Retroactively insert the initial version into the db.
INSERT INTO version(migration, create_time) VALUES 
('00_initial.sql', datetime('now', '-100 days'));

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES 
('01_new_sheet_archive.sql');
