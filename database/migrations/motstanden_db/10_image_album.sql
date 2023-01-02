-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('10_image_album.sql');

CREATE TABLE image_album(
    image_album_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL GENERATED ALWAYS AS (REPLACE(REPLACE(REPLACE(REPLACE(lower(title), 'æ', 'ae'), 'ø', 'oe' ), 'å', 'aa'), ' ', '-')) STORED,
    is_public BOOLEAN NOT NULL DEFAULT 0 CHECK(is_public = 0 OR is_public = 1),
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TRIGGER trig_image_album_updated_at
    AFTER UPDATE ON image_album FOR EACH ROW
BEGIN
    UPDATE image_album SET updated_at = current_timestamp
        WHERE image_album_id = old.image_album_id;
END;

CREATE TABLE image(
    image_id INTEGER PRIMARY KEY NOT NULL,
    image_album_id INTEGER NOT NULL,
    caption TEXT NOT NULL DEFAULT "",
    filename TEXT NOT NULL CHECK(like('files/%/bildealbum/%/%_._%', filename)),
    is_public BOOLEAN NOT NULL GENERATED ALWAYS AS (like('files/public/%', filename)) STORED,
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (image_album_id)
        REFERENCES image_album (image_album_id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT,
    FOREIGN KEY (created_by)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TRIGGER trig_image_updated_at
    AFTER UPDATE ON image FOR EACH ROW
BEGIN
    UPDATE image SET updated_at = current_timestamp
        WHERE image_id = old.image_id;
    UPDATE image_album SET updated_at = current_timestamp
        WHERE image_album_id = old.image_album_id;
END;