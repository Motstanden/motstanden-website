-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('13_lyric_md_content.sql');

CREATE TABLE song_lyric_new(
    song_lyric_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    melody TEXT,
    text_origin TEXT,
    description TEXT,
    is_popular BOOLEAN NOT NULL DEFAULT 0,

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
    AFTER UPDATE ON song_lyric FOR EACH ROW
BEGIN
    UPDATE song_lyric SET updated_at = current_timestamp
        WHERE song_lyric_id = old.song_lyric_id;
END;


CREATE VIEW vw_song_lyric AS
SELECT 
	song_lyric_id,
	title,
	content,
    is_popular,

	created_by as created_by_user_id,
    created_by.first_name || ' '
       || IIF(length(trim(created_by.middle_name)) = 0, '', created_by.middle_name || ' ')
       || created_by.last_name
       as created_by_full_name,
    sl.created_at,
	
	updated_by as updated_by_user_id,
    updated_by.first_name || ' '
       || IIF(length(trim(updated_by.middle_name)) = 0, '', updated_by.middle_name || ' ')
       || updated_by.last_name
       as updated_by_full_name,
    sl.updated_at
	
FROM 
	song_lyric sl
LEFT JOIN user created_by ON created_by.user_id = sl.created_by
LEFT JOIN user updated_by ON updated_by.user_id = sl.updated_by;
