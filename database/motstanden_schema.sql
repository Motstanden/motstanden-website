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
