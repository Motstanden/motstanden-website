-- Skip this table. It is not in use.
-- CREATE TABLE instrument(
--     instrument_id INTEGER PRIMARY KEY NOT NULL, 
--     instrument TEXT NOT NULL UNIQUE
-- );

-- Skip this table. It contains no data. 
-- CREATE TABLE musicsheet (
--     song_title TEXT NOT NULL,
--     song_isactive BOOLEAN,  -- TODO: Figure out how to handle booleans
--     musicsheet_pdf BLOB NOT NULL, -- b
--     instrument_id TEXT NOT NULL,
-- );

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

CREATE TABLE document (
    document_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    root_path TEXT,
    filename TEXT NOT NULL,
    url TEXT GENERATED ALWAYS AS ('/api/' || filename) STORED
);

-- TODO: Rewrite this
CREATE TABLE sheet_archive (
    sheet_archive_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    root_path TEXT,
    filename TEXT NOT NULL,
    url TEXT GENERATED ALWAYS AS ('/api/' || filename) STORED
);