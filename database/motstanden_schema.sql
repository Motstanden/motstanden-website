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
    phone_number INTEGER DEFAULT NULL CHECK(phone_number >= 10000000 AND phone_number <= 99999999),     -- Ensure number has 8 digits
    birth_date TEXT DEFAULT NULL CHECK(birth_date IS date(birth_date, '+0 days')),                      -- Check that format is 'YYYY-MM-DD'
    user_status_id INTEGER NOT NULL DEFAULT 1,
    start_date TEXT NOT NULL DEFAULT CURRENT_DATE CHECK(start_date IS date(start_date, '+0 days')),     -- Check that format is 'YYYY-MM-DD'
    end_date TEXT DEFAULT NULL CHECK(end_date IS date(end_date, '+0 days')),                            -- Check that format is 'YYYY-MM-DD'
    profile_picture TEXT NOT NULL CHECK(like('files/private/profilbilder/%_._%', profile_picture)) DEFAULT "files/private/profilbilder/boy.png",
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
        ON DELETE RESTRICT
);
CREATE TRIGGER trig_user_updated_at
    AFTER UPDATE ON user FOR EACH ROW
BEGIN
    UPDATE user SET updated_at = current_timestamp
        WHERE user_id = old.user_id;
END;
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
    birth_date,
    user_status.status as user_status,
    start_date,
    end_date,
    created_at,
    updated_at
FROM
    user
LEFT JOIN user_group USING (user_group_id)
LEFT JOIN user_rank USING (user_rank_id)
LEFT JOIN user_status USING (user_status_id)
/* vw_user(user_id,user_group_id,user_group,user_rank_id,user_rank,email,first_name,middle_name,last_name,cape_name,profile_picture,phone_number,birth_date,user_status,start_date,end_date,created_at,updated_at) */;
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
CREATE TABLE IF NOT EXISTS "quote" (
    quote_id INTEGER PRIMARY KEY NOT NULL,
    utterer TEXT NOT NULL,
    quote TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
CREATE TRIGGER trig_quote_updated_at
    AFTER UPDATE ON quote FOR EACH ROW
BEGIN
    UPDATE quote SET updated_at = current_timestamp
        WHERE quote_id = old.quote_id;
END;
CREATE TABLE event (
    event_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    start_date_time TEXT NOT NULL CHECK(start_date_time is datetime(start_date_time)),      -- yyyy-mm-dd hh:mm
    end_date_time TEXT DEFAULT NULL CHECK(end_date_time = NULL OR end_date_time is datetime(end_date_time)),        -- yyyy-mm-dd hh:mm
    key_info TEXT NOT NULL DEFAULT "[]",                                                    -- Json array    
    description TEXT NOT NULL,                                                              -- Html
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER NOT NULL DEFAULT created_by,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (updated_by)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
CREATE TRIGGER trig_event_updated_at
    AFTER UPDATE ON event FOR EACH ROW
BEGIN
    UPDATE event SET updated_at = current_timestamp
        WHERE event_id = old.event_id;
END;
CREATE TABLE participation_status (
    participation_status_id INTEGER PRIMARY KEY NOT NULL,
    status TEXT UNIQUE NOT NULL
);
CREATE TABLE event_participant (
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    participation_status_id INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (event_id)
        REFERENCES event (event_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (participation_status_id)
        REFERENCES participation_status (participation_status_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
CREATE VIEW vw_event
AS
SELECT
    event_id,
    title,
    start_date_time,
    end_date_time,
    description,
    created_by,
    created_by.first_name 
        || IIF(length(trim(created_by.middle_name)) = 0, '', created_by.middle_name) 
        || created_by.last_name 
        as created_by_full_name,
    updated_by as updated_by_user_id,
    updated_by.first_name 
        || IIF(length(trim(updated_by.middle_name)) = 0, '', updated_by.middle_name) 
        || updated_by.last_name 
        as updated_by_full_name
FROM 
    event
LEFT JOIN user created_by
ON  created_by.user_id = event.created_by
LEFT JOIN user updated_by
ON  updated_by.user_id = event.updated_by
/* vw_event(event_id,title,start_date_time,end_date_time,description,created_by,created_by_full_name,updated_by_user_id,updated_by_full_name) */;
CREATE VIEW vw_event_participant
AS 
SELECT 
	event_id,
	JSON_GROUP_ARRAY(JSON_OBJECT(
		'userId', 				user_id,
		'firstName', 			user.first_name,
		'middleName',			user.middle_name,
		'lastName',				user.last_name,
		'profilePicture',		user.profile_picture,
		'participationStatus',	participation_status.status
	)) AS participants
FROM
	event_participant
LEFT JOIN user USING(user_id)
LEFT JOIN participation_status USING(participation_status_id)
GROUP BY event_id
/* vw_event_participant(event_id,participants) */;
