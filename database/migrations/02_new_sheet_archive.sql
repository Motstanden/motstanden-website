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
('02_new_sheet_archive.sql');

-- ::::::::::::::::::::::::::
--  new document table
-- ::::::::::::::::::::::::::

-- DROP TABLE document;
CREATE TABLE document_new(
    document_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    filename TEXT NOT NULL CHECK(like('files/public/dokumenter/%_._%', filename) OR like('files/private/dokumenter/%_._%', filename)),
    is_public BOOLEAN NOT NULL GENERATED ALWAYS AS (iif(like('files/public/%', filename), 1, 0)) STORED
);

INSERT INTO document_new(title, filename) 
    SELECT title, full_filename FROM document;

DROP TABLE document;
ALTER TABLE document_new RENAME TO document;

-- ::::::::::::::::::::::::::
--      sheet archive
-- ::::::::::::::::::::::::::

CREATE TABLE tone(
    tone_id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    key_signature TEXT NOT NULL UNIQUE,
    semitones_from_c INTEGER NOT NULL
);

-- Insert all tones in the 'circle of fifths' order
INSERT INTO tone(name, key_signature, semitones_from_c) VALUES
    ('Gb',  'bbbbbb',       6),
    ('Db',  'bbbbb',        1),
    ('Ab',  'bbbb',         8),
    ('Eb',  'bbb',          3),
    ('Bb',  'bb',           10),
    ('F',   'b',            5),
    ('C',   '',             0),
    ('G',   '#',            7),
    ('D',   '##',           2),
    ('A',   '###',          9),
    ('E',   '####',         4),
    ('H',   '#####',        11),
    ('F#',  '######',       6),
    ('C#',  '#######',      1),
    ('G#',  '########',     8),
    ('D#',  '#########',    3),
    ('A#',  '##########',   10);

CREATE TABLE clef(
    clef_id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    unicode_symbol TEXT NOT NULL
);

-- Insert all possible clef values into the table
INSERT INTO clef(name, unicode_symbol) VALUES
    ('G-nøkkel',        '𝄞'),
    ('F-nøkkel',        '𝄢'),
    ('C-nøkkel',        '𝄡'),
    ('Trommenøkkel',    '𝄦');

CREATE TABLE instrument_category(
    instrument_category_id INTERGER PRIMARY KEY NOT NULL,    
    category TEXT NOT NULL UNIQUE
);

INSERT INTO instrument_category(instrument_category_id, category) VALUES
    (1,     'Fløyter'),
    (2,     'Rørblås'),
    (3,     'Klarinetter'),
    (4,     'Trompeter'),
    (5,     'Saksofoner'),
    (6,     'Grovmessing'),
    (7,     'Tuba'),
    (8,     'Perkusjon'),
    (9,     'Storband'),
    (10,    'Annet');

CREATE TABLE instrument(
    instrument_id INTEGER PRIMARY KEY NOT NULL, 
    instrument TEXT NOT NULL UNIQUE,
    max_voices TEXT NOT NULL,
    instrument_category_id INTEGER NOT NULL,
    FOREIGN KEY (instrument_category_id) 
        REFERENCES instrument_category(instrument_category_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

INSERT INTO 
    instrument(instrument, max_voices, instrument_category_id) 
VALUES
    -- Fløyter
    ('Pikkolofløyte',    2,  1), 
    ('Tverrfløyte',      4,  1),

    -- Rørblås
    ('Obo',              2,  2),
    ('Engelsk horn',     2,  2),
    ('Fagott',           2,  2),

    -- Klarinettet
    ('Altklarinett',     2,  3),
    ('Klarinett',        4,  3),
    ('Bassklarinett',    2,  3),

    -- Trompeter
    ('Trompet',          4,  4),
    ('Kornett',          4,  4),
    ('Flygelhorn',       4,  4),

    -- Saksofoner
    ('Sopransaksofon',   2,  5),
    ('Altsaksofon',      3,  5),
    ('Tenorsaksofon',    2,  5),
    ('Barytonsaksofon',  2,  5),

    -- Grovmessing
    ('Horn',             6,  6),
    ('Baryton',          3,  6),
    ('Eufonium',         3,  6),
    ('Alttrombone',      4,  6),
    ('Trombone',         4,  6),
    ('Basstrombone',     2,  6),

    -- Tuba
    ('Tuba',             3,  7),

    -- Perkusjon
    ('Slagverk',         1,  8),
    ('Skarptromme',      1,  8),
    ('Symbaler',         1,  8),
    ('Basstromme',       1,  8),
    ('Pauker',           1,  8),
    ('Tamburin',         1,  8),
    ('Kubjelle',         1,  8),
    ('Perkusjon',        6,  8),

    -- Storband
    ('Klokkespill',      1,  9),
    ('Piano',            1,  9),
    ('Gitar',            1,  9),
    ('Bassgitar',        1,  9),

    -- Annet
    ('Akkorder',         1,  10),
    ('Partitur',         1,  10),
    ('Superpart',        1,  10), 
    ('Annet',            1,  10);

CREATE TABLE five_part_system(
    instrument_id INTEGER NOT NULL,
    part_number INTEGER NOT NULL CHECK (part_number >= 1 AND part_number <= 5),
    PRIMARY KEY (instrument_id, part_number),
    FOREIGN KEY (instrument_id)
        REFERENCES instrument(instrument_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Pikkolofløyte: Part 1-3
INSERT INTO five_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Pikkolofløyte';
INSERT INTO five_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Pikkolofløyte';
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Pikkolofløyte';

-- Tverrfløyte: Part 2-4
INSERT INTO five_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Tverrfløyte';
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Tverrfløyte';
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Tverrfløyte';

-- Obo: Part 4-5
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Obo';
INSERT INTO five_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Obo';


CREATE TABLE seven_part_system(
    instrument_id INTEGER NOT NULL,
    part_number INTEGER NOT NULL CHECK (part_number >= 1 AND part_number <= 7),
    PRIMARY KEY (instrument_id, part_number),
    FOREIGN KEY (instrument_id)
        REFERENCES instrument(instrument_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Pikkolofløyte: Part 1-3
INSERT INTO seven_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Pikkolofløyte';
INSERT INTO seven_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Pikkolofløyte';
INSERT INTO seven_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Pikkolofløyte';

-- Tverrfløyte: Part 3-5
INSERT INTO seven_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Tverrfløyte';
INSERT INTO seven_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Tverrfløyte';
INSERT INTO seven_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Tverrfløyte';

-- Obo: Part 6-7
INSERT INTO seven_part_system SELECT instrument_id, 6 FROM instrument WHERE instrument = 'Obo';
INSERT INTO seven_part_system SELECT instrument_id, 7 FROM instrument WHERE instrument = 'Obo';

-- ****************** WIP *************************

-- CREATE TABLE sheet_archive_file (
--     sheet_archive_file_id INTEGER PRIMARY KEY NOT NULL,
--     sheet_archive_song_id INTEGER NOT NULL,
--     FOREIGN KEY (sheet_archive_song_id)
--         REFERENCES sheet_archive_song (sheet_archive_song_id)
--         ON UPDATE CASCADE 
--         ON DELETE RESTRICT
-- );


-- CREATE TABLE sheet_archive_song (
--     sheet_archive_song_id INTEGER PRIMARY KEY NOT NULL,
--     title TEXT NOT NULL,
--     is_in_repertoire BOOLEAN NOT NULL
--     -- TODO: GROUP column
-- );
