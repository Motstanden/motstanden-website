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
    updated_by INTEGER NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY(updated_by)
        REFERENCES user(user_id)
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
    updated_by INTEGER NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (image_album_id)
        REFERENCES image_album (image_album_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (created_by)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY(updated_by)
        REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TRIGGER trig_image_updated_at
    AFTER UPDATE ON image FOR EACH ROW
BEGIN
    UPDATE image SET updated_at = current_timestamp
        WHERE image_id = old.image_id;
    UPDATE image_album SET 
        updated_at = current_timestamp,
        updated_by = new.updated_by
    WHERE 
        image_album_id = old.image_album_id;
END;


CREATE VIEW vw_image_album
AS
SELECT
    image_album_id,
    title,
    url,
    is_public,
	cover_image_url,
    IFNULL(image_count, 0) as image_count,

    album.created_by as created_by_user_id,
    created_by.first_name || ' '
        || IIF(length(trim(created_by.middle_name)) = 0, '', created_by.middle_name || ' ')
        || created_by.last_name
        as created_by_full_name,
    album.created_at,

    album.updated_by as updated_by_user_id,
    updated_by.first_name || ' '
        || IIF(length(trim(updated_by.middle_name)) = 0, '', updated_by.middle_name || ' ')
        || updated_by.last_name
        as updated_by_full_name,
    album.updated_at

FROM
    image_album album
LEFT JOIN (
	SELECT 
		filename as cover_image_url,
		image_album_id,
        COUNT() as image_count
	FROM 
		image
	GROUP BY image_album_id
) USING(image_album_id)
LEFT JOIN user created_by
ON  created_by.user_id = album.created_by
LEFT JOIN user updated_by
ON  updated_by.user_id = album.updated_by;