CREATE TABLE version (
    version_id INTEGER PRIMARY KEY NOT NULL,
    migration TEXT,
    create_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    instrument TEXT NOT NULL,
    max_voices TEXT NOT NULL,
    instrument_category_id INTEGER NOT NULL,
    FOREIGN KEY (instrument_category_id) 
        REFERENCES instrument_category(instrument_category_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
    UNIQUE(instrument, instrument_category_id)
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
LEFT JOIN instrument_category USING(instrument_category_id)
/* vw_instrument(instrument_id,instrument,max_voices,cetegory) */;
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
    title TEXT NOT NULL,
    extra_info TEXT NOT NULL DEFAULT "",
    UNIQUE(title, extra_info)
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
    transposition INTEGER NOT NULL,
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
        ON DELETE RESTRICT,
    FOREIGN KEY (transposition)
        REFERENCES tone (tone_id)
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
    instrument_category.category as instrument_category, 
    tone.name as transposition
FROM 
    song_file 
LEFT JOIN song_title USING(song_title_id)
LEFT JOIN clef USING(clef_id)
LEFT JOIN instrument USING(instrument_id)
LEFT JOIN instrument_category USING(instrument_category_id)
LEFT JOIN tone ON song_file.transposition = tone.tone_id
/* vw_song_file(song_file_id,title,filename,clef_name,clef_unicode_symbol,instrument,instrument_voice,instrument_category,transposition) */;
