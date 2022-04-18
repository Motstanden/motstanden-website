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
('01_initial.sql', datetime('now', '-100 days'));

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES 
('02_refactor_db.sql');

-- ::::::::::::::::::::::::::
--  new document table
-- ::::::::::::::::::::::::::

CREATE TABLE document_new(
    document_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    filename TEXT NOT NULL CHECK(like('files/public/dokumenter/%_._%', filename) OR like('files/private/dokumenter/%_._%', filename)),
    is_public BOOLEAN NOT NULL GENERATED ALWAYS AS (like('files/public/%', filename)) STORED
);

INSERT INTO document_new(title, filename) 
    SELECT title, full_filename FROM document;

DROP TABLE document;
ALTER TABLE document_new RENAME TO document;

UPDATE document 
SET filename = 'files/public/dokumenter/motstandens-statutter.pdf'
WHERE filename like '%motstandens-statutter.pdf';

-- ::::::::::::::::::::::::::
--  new song_lyric table
-- ::::::::::::::::::::::::::

CREATE TABLE song_lyric_new(
    song_lyric_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    filename TEXT NOT NULL CHECK(like('files/public/studenttraller/%_.html', filename)),
    song_melody TEXT,
    song_text_origin TEXT,
    song_description TEXT
);

INSERT INTO 
    song_lyric_new(title, filename, song_melody, song_text_origin, song_description)
SELECT 
    title, full_filename, song_melody, song_text_origin, song_description
FROM 
    song_lyric; 

DROP TABLE song_lyric;
ALTER TABLE song_lyric_new RENAME TO song_lyric;

-- ::::::::::::::::::::::::::::::::::
--    Drop sheet_archive. 
-- (use sheet_archive.db instead)
-- ::::::::::::::::::::::::::::::::::
DROP TABLE sheet_archive;