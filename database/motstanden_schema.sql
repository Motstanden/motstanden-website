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
CREATE TABLE semester_name (
    semester_name_id INTEGER PRIMARY KEY NOT NULL,
    name TEXT UNIQUE NOT NULL 
);
CREATE TABLE user_status(
    user_status_id INTEGER PRIMARY KEY NOT NULL,
    status TEXT UNIQUE NOT NULL
);
CREATE TABLE user (
    user_id INTEGER PRIMARY KEY NOT NULL,
    user_group_id INTEGER NOT NULL DEFAULT 1,
    user_rank_id INTEGER NOT NULL DEFAULT 1,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT NOT NULL DEFAULT "",
    last_name TEXT NOT NULL,
    cape_name TEXT NOT NULL DEFAULT "",
    phone_number INTEGER CHECK(phone_number >= 10000000 AND phone_number <= 99999999), -- Ensure number has 8 digits
    user_status_id INTEGER NOT NULL DEFAULT 1,
    start_semester_name_id INTEGER NOT NULL,
    start_year INTEGER NOT NULL CHECK(start_year >= 2018),
    end_semester_name_id INTEGER 
        CHECK( (end_semester_name_id IS NULL  AND  end_year IS NULL)    OR    (end_semester_name_id IS NOT NULL  AND  end_year IS NOT NULL)), -- semester_name and year should *both* exist or not exist.  
    end_year INTEGER CHECK( end_year >= 2018 AND end_year >= start_year),
    profile_picture TEXT NOT NULL CHECK(like('files/private/profilbilder/%_._%', profile_picture)) DEFAULT "files/private/profilbilder/boy.png",
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_group_id)
         REFERENCES user_group (user_group_id)
         ON UPDATE CASCADE
         ON DELETE RESTRICT,
    FOREIGN KEY (user_rank_id)
        REFERENCES user_rank (user_rank_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (user_status_id)
        REFERENCES user_status (user_status_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (start_semester_name_id)
        REFERENCES semester_name (semester_name_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (end_semester_name_id)
        REFERENCES semester_name (semester_name_id)
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
    cape_name,
    profile_picture,
    phone_number,
    user_status.status as user_status,
    start_semester.name as start_semester,
    start_year,
	end_semester.name as end_semester,
    end_year,
    created_at
FROM
    user
LEFT JOIN user_group USING (user_group_id)
LEFT JOIN user_rank USING (user_rank_id)
LEFT JOIN user_status USING (user_status_id)
LEFT JOIN semester_name start_semester ON 
    start_semester.semester_name_id = user.start_semester_name_id
LEFT JOIN semester_name end_semester ON 
    end_semester.semester_name_id = user.end_semester_name_id
/* vw_user(user_id,user_group_id,user_group,user_rank_id,user_rank,email,first_name,middle_name,last_name,cape_name,profile_picture,phone_number,user_status,start_semester,start_year,end_semester,end_year,created_at) */;
CREATE TABLE login_token (
    token_id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    issued_at INTEGER NOT NULL,
    expire_at INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
