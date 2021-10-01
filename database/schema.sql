CREATE TABLE ping(
    ping TEXT
);
CREATE TABLE quote (
    quote_id INTEGER PRIMARY KEY NOT NULL,
    utterer TEXT NOT NULL,
    quote TEXT NOT NULL 
);
CREATE TABLE user_account (
    user_account_id INTEGER PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);
CREATE TABLE sheet_archive (
    sheet_archive_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    root_path TEXT,
    is_public BOOLEAN NOT NULL DEFAULT 0,
    filename TEXT NOT NULL,
    full_filename TEXT GENERATED ALWAYS AS (root_path || filename) VIRTUAL,
    url TEXT GENERATED ALWAYS AS (CASE is_public WHEN 1 THEN '/api/files/public/' || filename ELSE '/api/files/private/' || filename END) VIRTUAL
);
CREATE TABLE version (
    version_id INTEGER PRIMARY KEY NOT NULL,
    migration TEXT,
    create_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "document"(
    document_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    filename TEXT NOT NULL CHECK(like('files/public/dokumenter/%_._%', filename) OR like('files/private/dokumenter/%_._%', filename)),
    is_public BOOLEAN NOT NULL GENERATED ALWAYS AS (iif(like('files/public/%', filename), 1, 0)) STORED
);
CREATE TABLE IF NOT EXISTS "song_lyric"(
    song_lyric_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    filename TEXT NOT NULL CHECK(like('files/public/studenttraller/%_.html', filename)),
    song_melody TEXT,
    song_text_origin TEXT,
    song_description TEXT
);
CREATE TABLE tone(
    tone_id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE,
    key_signature TEXT NOT NULL UNIQUE,
    semitones_from_c INTEGER NOT NULL
);
CREATE TABLE clef(
    clef_id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    unicode_symbol TEXT NOT NULL
);
CREATE TABLE instrument_category(
    instrument_category_id INTERGER PRIMARY KEY NOT NULL,    
    category TEXT NOT NULL UNIQUE
);
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
CREATE TABLE song_category(
    song_category_id INTEGER PRIMARY KEY NOT NULL,
    category TEXT NOT NULL UNIQUE
);
CREATE TABLE song_title (
    song_title_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL
);
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
    instrument_category.category as instrument_category 
FROM 
    song_file 
LEFT JOIN song_title USING(song_title_id)
LEFT JOIN clef using(clef_id)
LEFT JOIN instrument using(instrument_id)
LEFT JOIN instrument_category USING(instrument_category_id)
/* vw_song_file(song_file_id,title,filename,clef_name,clef_unicode_symbol,instrument,instrument_category) */;
