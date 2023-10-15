-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('13_lyric_md_content.sql');

CREATE TABLE song_lyric_new(
    song_lyric_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    melody TEXT,
    text_origin TEXT,
    description TEXT,

    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(created_by)
        REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY(updated_by)
        REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

INSERT INTO 
    song_lyric_new(title, content, melody, text_origin, description, created_by, updated_by)
SELECT
    title, '', song_melody, song_text_origin, song_description, 1, 1
FROM
    song_lyric;

DROP TABLE song_lyric;
ALTER TABLE song_lyric_new RENAME TO song_lyric;

CREATE TRIGGER trig_song_lyric_updated_at
    AFTER UPDATE ON event FOR EACH ROW
BEGIN
    UPDATE song_lyric SET updated_at = current_timestamp
        WHERE song_lyric_id = old.song_lyric_id;
END;