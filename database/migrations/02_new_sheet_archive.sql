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

-- TODO: Spør Gunnar om denne
INSERT INTO instrument_category(instrument_category_id, category) VALUES
(1, 'Fløyte'),
(2, 'Klarinett'),
(3, 'Trompet'),
(4, 'Saksofon'),
(5, 'Baryton'),
(6, 'Tuba'),
(7, 'Perkusjon'),
(8, 'Storband'),
(9, 'Annet');

CREATE TABLE instrument(
    instrument_id INTEGER PRIMARY KEY NOT NULL, 
    instrument TEXT NOT NULL UNIQUE,
    max_voices TEXT NOT NULL,
    five_part_voice TEXT,
    seven_part_voice TEXT,
    instrument_category_id INTEGER NOT NULL
);

-- TODO:
--  * Spør Gunnar om a fylle 5-part og 7-part stemmer
INSERT INTO 
    instrument(instrument, max_voices, five_part_voice, seven_part_voice, instrument_category_id) 
VALUES
-- Fløyte
 ('Pikkolofløyte',  2,      NULL,   NULL,   1), 
 ('TverrFløyte',    4,      NULL,   NULL,   1),
 ('Obo',            2,      NULL,   NULL,   1),
 ('Fagott',         2,      NULL,   NULL,   1),

-- Klarinett
 ('Altklarinett',   2,      NULL,   NULL,   2),
 ('Klarinett',      4,      NULL,   NULL,   2),
 ('Bassklarinett',  2,      NULL,   NULL,   2),

-- Trompet ???
 ('Trompet',        4,      NULL,   NULL,   3),
 ('Kornett',        4,      NULL,   NULL,   3),
 ('Flygelhorn',     4,      NULL,   NULL,   3),

-- Saksofon
 ('Sopransaksofon',     2,  NULL,   NULL,   4),
 ('Altsaksofon',        3,  NULL,   NULL,   4),
 ('Tenorsaksofon',      2,  NULL,   NULL,   4),
 ('Barytonsaksofon',    2,  NULL,   NULL,   4),

-- Baryton
 ('Horn',           6,      NULL,   NULL,   5),  -- Spør gunnar om denne
 ('Baryton',        3,      NULL,   NULL,   5),
 ('Eufonium',       3,      NULL,   NULL,   5),
 ('Trombone',       4,      NULL,   NULL,   5),
 ('Basstrombone',   2,      NULL,   NULL,   5),

-- Tuba
 ('Tuba',           3,      NULL,   NULL,   6),

-- Perkusjon
('Slagverk',        1,      NULL,   NULL,   7),
('Skarptromme',     1,      NULL,   NULL,   7),
('Symbaler',        1,      NULL,   NULL,   7),
('Basstromme',      1,      NULL,   NULL,   7),
('Pauker',          1,      NULL,   NULL,   7),
('Tamburin',        1,      NULL,   NULL,   7),
('Kubjelle',        1,      NULL,   NULL,   7),
('Perkusjon',       6,      NULL,   NULL,   7),

-- Storband
 ('Akkorder',       1,      NULL,   NULL,   8),
 ('Klokkespill',    1,      NULL,   NULL,   8),
 ('Piano',          1,      NULL,   NULL,   8),
 ('Gitar',          1,      NULL,   NULL,   8),
 ('Bassgitar',      1,      NULL,   NULL,   8),

('Annet',           1,      NULL,   NULL,   9), -- Spør Gunnar om denne
('Partitur',        1,      NULL,   NULL,   9);



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
