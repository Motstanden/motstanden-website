CREATE TABLE quote (
    quote_id INTEGER PRIMARY KEY NOT NULL,
    utterer TEXT NOT NULL,
    quote TEXT NOT NULL 
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
    is_public BOOLEAN NOT NULL GENERATED ALWAYS AS (like('files/public/%', filename)) STORED
);
CREATE TABLE IF NOT EXISTS "song_lyric"(
    song_lyric_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    filename TEXT NOT NULL CHECK(like('files/public/studenttraller/%_.html', filename)),
    song_melody TEXT,
    song_text_origin TEXT,
    song_description TEXT
);
CREATE TABLE user_group (
    user_group_id INTEGER PRIMARY KEY NOT NULL,
    name TEXT UNIQUE NOT NULL
);
CREATE TABLE user_rank (
    user_rank_id INTEGER PRIMARY KEY NOT NULL,
    name TEXT UNIQUE NOT NULL
);
CREATE TABLE user (
    user_id INTEGER PRIMARY KEY NOT NULL,
    user_group_id INTEGER NOT NULL DEFAULT 1,
    user_rank_id INTEGER NOT NULL DEFAULT 1,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT DEFAULT "",
    last_name TEXT NOT NULL,
    profile_picture TEXT NOT NULL CHECK(like('files/private/profilbilder/%_._%', profile_picture)) DEFAULT "files/private/profilbilder/boy.png",
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_group_id)
         REFERENCES user_group (user_group_id)
         ON UPDATE CASCADE
         ON DELETE RESTRICT,
    FOREIGN KEY (user_rank_id)
        REFERENCES user_rank (user_rank_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
CREATE VIEW vw_user 
AS
SELECT
    user_id,
    user_group_id,
    user_group.name as user_group,
    user_rank_id,
    user_rank.name as user_rank,
    email,
    first_name,
    middle_name,
    last_name,
    profile_picture,
    created_at
FROM
    user
LEFT JOIN user_group USING (user_group_id)
LEFT JOIN user_rank USING (user_rank_id)
/* vw_user(user_id,user_group_id,user_group,user_rank_id,user_rank,email,first_name,middle_name,last_name,profile_picture,created_at) */;
