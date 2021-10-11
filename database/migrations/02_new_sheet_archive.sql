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

CREATE VIEW vw_instrument
AS
SELECT 
    instrument_id,
    instrument,
    max_voices,
    instrument_category.category AS cetegory
FROM 
     instrument
LEFT JOIN instrument_category USING(instrument_category_id);

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

CREATE TABLE seven_part_system(
    instrument_id INTEGER NOT NULL,
    part_number INTEGER NOT NULL CHECK (part_number >= 1 AND part_number <= 7),
    PRIMARY KEY (instrument_id, part_number),
    FOREIGN KEY (instrument_id)
        REFERENCES instrument(instrument_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ****************** WIP *************************

CREATE TABLE song_category(
    song_category_id INTEGER PRIMARY KEY NOT NULL,
    category TEXT NOT NULL UNIQUE
);

-- TODO: Insert more categories ?
INSERT INTO song_category(category) VALUES
    ('Repertoar'),
    ('Marsjnoter'),
    ('17. mai'),
    ('SMASH'),
    ('Filmmusikk'),
    ('Spillmusikk');

CREATE TABLE song_title (
    song_title_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT UNIQUE NOT NULL
);

-- song_title and song_category has a many to many relationship
CREATE TABLE song_title_category(
    song_title_id INTEGER NOT NULL,
    song_category_id INTEGER NOT NULL,
    PRIMARY KEY (song_title_id, song_category_id),
    FOREIGN KEY (song_title_id)
        REFERENCES song_title(song_title_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (song_category_id)
        REFERENCES song_category(song_category_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE song_file (
    song_file_id INTEGER PRIMARY KEY NOT NULL,
    song_title_id INTEGER NOT NULL,
    filename TEXT NOT NULL CHECK(like('files/private/notearkiv/%_._%', filename)),
    clef_id INTEGER NOT NULL,
    instrument_id INTERGER NOT NULL,
    instrument_voice INTEGER NOT NULL DEFAULT 1 CHECK(instrument_voice > 0),
    FOREIGN KEY (song_title_id)
        REFERENCES song_title (song_title_id)
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
    FOREIGN KEY (clef_id) 
        REFERENCES clef (clef_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (instrument_id)
        REFERENCES instrument (instrument_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TRIGGER trig_song_file_before_insert
    BEFORE INSERT ON song_file
BEGIN
    SELECT
        max_voices,
        CASE
            WHEN NEW.instrument_voice > max_voices OR NEW.instrument_voice <= 0
            THEN RAISE(ABORT, 'The instrument_voice number is out of range.')
        END
    FROM 
        instrument 
    WHERE 
        instrument_id = NEW.instrument_id;
END;

CREATE TRIGGER trig_song_file_before_update
    BEFORE UPDATE ON song_file
BEGIN
    SELECT
        max_voices,
        CASE
            WHEN NEW.instrument_voice > max_voices OR NEW.instrument_voice <= 0
            THEN RAISE(ABORT, 'The instrument_voice number is out of range.')
        END
    FROM 
        instrument 
    WHERE 
        instrument_id = NEW.instrument_id;
END;

CREATE VIEW vw_song_file
AS
SELECT 
    song_file_id, 
    song_title.title as title,
    filename,
    clef.name as clef_name,
    clef.unicode_symbol as clef_unicode_symbol,
    instrument.instrument as instrument,
    instrument_voice,
    instrument_category.category as instrument_category 
FROM 
    song_file 
LEFT JOIN song_title USING(song_title_id)
LEFT JOIN clef USING(clef_id)
LEFT JOIN instrument USING(instrument_id)
LEFT JOIN instrument_category USING(instrument_category_id);

CREATE TRIGGER trig_vw_song_file_instead_of_insert
    INSTEAD OF INSERT ON vw_song_file
BEGIN
    INSERT OR IGNORE INTO song_title(title) VALUES (NEW.title);

    INSERT OR ROLLBACK INTO 
        song_file(song_title_id, filename, clef_id, instrument_id, instrument_voice)
    SELECT 
        song_title_id,
        NEW.filename,
        clef.clef_id,
        instrument.instrument_id,
        NEW.instrument_voice
    FROM 
        song_title
    INNER JOIN clef ON clef.name = NEW.clef_name
    INNER JOIN instrument ON instrument.instrument = NEW.instrument
    WHERE NEW.title = song_title.title;
END;

-- Debug vw_song_file
-- INSERT INTO song_title(title) VALUES ('Olsenbanden');
-- INSERT INTO 
-- 	song_file(song_title_id, filename, clef_id, instrument_id) 
-- VALUES
-- 	(1, 'files/private/notearkiv/olsenbanden_baryton.pdf', 1, 17);
-- SELECT * FROM vw_song_file;

-- Debug vw_song_file
INSERT INTO 
    vw_song_file(title, filename, clef_name, instrument_voice, instrument) 
VALUES 
    ('Olsenbanden', 'files/private/notearkiv/olsenbanden_baryton.pdf', 'G-nøkkel', 1, 'Baryton');
SELECT * FROM vw_song_file;



-- Test that max_voices trigger works
--INSERT INTO song_title(title) VALUES ('Olsenbanden');
--INSERT INTO 
--	song_file(song_title_id, filename, clef_id, instrument_id, instrument_voice)
--VALUES
--	(1, 'files/private/notearkiv/myfile.pdf', 1, 1, 3);
