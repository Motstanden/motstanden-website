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
    middle_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL,
    full_name TEXT NOT NULL GENERATED ALWAYS AS (
        first_name || ' '
        || IIF(length(trim(middle_name)) = 0, '', middle_name || ' ')
        || last_name
    ) STORED,
    cape_name TEXT NOT NULL DEFAULT '',
    phone_number INTEGER DEFAULT NULL CHECK(phone_number >= 10000000 AND phone_number <= 99999999),     -- Ensure number has 8 digits
    birth_date TEXT DEFAULT NULL CHECK(birth_date IS date(birth_date, '+0 days')),                      -- Check that format is 'YYYY-MM-DD'
    user_status_id INTEGER NOT NULL DEFAULT 1,
    start_date TEXT NOT NULL DEFAULT CURRENT_DATE CHECK(start_date IS date(start_date, '+0 days')),     -- Check that format is 'YYYY-MM-DD'
    end_date TEXT DEFAULT NULL CHECK(end_date IS date(end_date, '+0 days')),                            -- Check that format is 'YYYY-MM-DD'
    profile_picture TEXT NOT NULL CHECK(like('files/private/profilbilder/%_._%', profile_picture)) DEFAULT 'files/private/profilbilder/boy.png',
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
    full_name,
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
/* vw_user(user_id,user_group_id,user_group,user_rank_id,user_rank,email,first_name,middle_name,last_name,full_name,cape_name,profile_picture,phone_number,birth_date,user_status,start_date,end_date,created_at,updated_at) */;
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
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by)
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
    start_date_time TEXT NOT NULL CHECK(start_date_time is datetime(start_date_time)),                          -- yyyy-mm-dd hh:mm
    end_date_time TEXT DEFAULT NULL CHECK(end_date_time = NULL OR end_date_time is datetime(end_date_time)),    -- yyyy-mm-dd hh:mm
    key_info TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(key_info) = 1),                                                                        -- Json array    
    description TEXT NOT NULL,                                                                                  -- Html
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
CREATE TABLE rumour (
    rumour_id INTEGER PRIMARY KEY NOT NULL,
    rumour TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
CREATE TRIGGER trig_rumour_updated_at
    AFTER UPDATE ON rumour FOR EACH ROW
BEGIN
    UPDATE rumour SET updated_at = current_timestamp
        WHERE rumour_id = old.rumour_id;
END;
CREATE TABLE poll (
	poll_id INTEGER PRIMARY KEY,
	title TEXT NOT NULL,
	type TEXT CHECK (type IN ('single', 'multiple')),
	created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(created_by) REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY(updated_by) REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE TABLE poll_option (
	poll_option_id INTEGER PRIMARY KEY,
	text TEXT NOT NULL,
	poll_id INTEGER NOT NULL,
	FOREIGN KEY (poll_id) REFERENCES poll (poll_id) ON DELETE CASCADE
);
CREATE TABLE poll_vote (
	poll_vote_id INTEGER PRIMARY KEY,
	poll_option_id INTEGER NOT NULL,
	user_id INTEGER NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (poll_option_id) REFERENCES poll_option (poll_option_id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT,
	UNIQUE (poll_option_id, user_id)
);
CREATE VIEW vw_poll_option AS
SELECT 
	o.poll_option_id,
	text,
	poll_id,
	COUNT(v.poll_option_id) as votes
FROM 
	poll_option o
LEFT JOIN poll_vote v ON o.poll_option_id = v.poll_option_id  
GROUP BY o.poll_option_id
/* vw_poll_option(poll_option_id,text,poll_id,votes) */;
CREATE VIEW vw_poll AS
SELECT 
	poll_id,
	title,
	type,
	created_by as created_by_user_id,
	created_by.full_name as created_by_full_name,
	p.created_at,
	updated_by as updated_by_user_id,
	updated_by.full_name as updated_by_full_name,
    p.updated_at
FROM 
	poll p
LEFT JOIN user created_by ON created_by.user_id = p.created_by
LEFT JOIN user updated_by ON updated_by.user_id = p.updated_by
/* vw_poll(poll_id,title,type,created_by_user_id,created_by_full_name,created_at,updated_by_user_id,updated_by_full_name,updated_at) */;
CREATE TRIGGER trig_poll_updated_at
    AFTER UPDATE ON poll FOR EACH ROW
BEGIN
    UPDATE poll SET updated_at = current_timestamp
        WHERE poll_id = old.poll_id;
END;
CREATE TRIGGER trig_poll_vote_updated_at
    AFTER UPDATE ON poll_vote FOR EACH ROW
BEGIN
    UPDATE poll_vote SET updated_at = current_timestamp
        WHERE poll_vote_id = old.poll_vote_id;
END;
CREATE VIEW vw_event
AS
SELECT
    event_id,
    title,
    start_date_time,
    end_date_time,
    key_info,
    description,
    created_by as created_by_user_id,
    created_by.full_name as created_by_full_name,
    e.created_at,
    updated_by as updated_by_user_id,
    updated_by.full_name as updated_by_full_name,
    e.updated_at,
    IIF( end_date_time is  NULL,
        IIF(datetime(start_date_time) < datetime('now'), 0, 1),
        IIF(datetime(end_date_time)   < datetime('now'), 0, 1)
    ) is_upcoming
FROM 
    event e
LEFT JOIN user created_by
ON  created_by.user_id = e.created_by
LEFT JOIN user updated_by
ON  updated_by.user_id = e.updated_by
/* vw_event(event_id,title,start_date_time,end_date_time,key_info,description,created_by_user_id,created_by_full_name,created_at,updated_by_user_id,updated_by_full_name,updated_at,is_upcoming) */;
CREATE TABLE IF NOT EXISTS "song_lyric"(
    song_lyric_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
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
    created_by.full_name as created_by_full_name,
    sl.created_at,
	updated_by as updated_by_user_id,
    updated_by.full_name as updated_by_full_name,
    sl.updated_at
FROM 
	song_lyric sl
LEFT JOIN user created_by ON created_by.user_id = sl.created_by
LEFT JOIN user updated_by ON updated_by.user_id = sl.updated_by
/* vw_song_lyric(song_lyric_id,title,content,is_popular,created_by_user_id,created_by_full_name,created_at,updated_by_user_id,updated_by_full_name,updated_at) */;
CREATE TABLE simple_text(
    simple_text_id INTEGER PRIMARY KEY NOT NULL,
    key TEXT NOT NULL UNIQUE COLLATE NOCASE,
    text TEXT NOT NULL,

    updated_by INTEGER NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(updated_by)
        REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
CREATE TRIGGER trig_simple_text_updated_at
    AFTER UPDATE ON simple_text FOR EACH ROW
BEGIN
    UPDATE simple_text SET updated_at = current_timestamp
        WHERE simple_text_id = old.simple_text_id;
END;
CREATE VIEW vw_event_participant
AS 
SELECT 
	event_id,
    user_id,
    user.first_name,
    user.middle_name,
    user.last_name,
    user.full_name,
    user.profile_picture,
    participation_status.status
FROM
	event_participant
LEFT JOIN user USING(user_id)
LEFT JOIN participation_status USING(participation_status_id)
/* vw_event_participant(event_id,user_id,first_name,middle_name,last_name,full_name,profile_picture,status) */;
CREATE TABLE event_comment (
    event_comment_id INTEGER PRIMARY KEY,
    event_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    parent_comment_id INTEGER DEFAULT NULL,
    FOREIGN KEY(event_id) REFERENCES event (event_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(created_by) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY(parent_comment_id) REFERENCES event_comment(event_comment_id) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE TRIGGER trig_event_comment_updated_at
    AFTER UPDATE ON event_comment FOR EACH ROW
BEGIN
    UPDATE event_comment SET updated_at = current_timestamp
        WHERE event_comment_id = old.event_comment_id;
END;
CREATE TABLE poll_comment (
    poll_comment_id INTEGER PRIMARY KEY,
    poll_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    parent_comment_id INTEGER DEFAULT NULL,    
    FOREIGN KEY (poll_id) REFERENCES poll (poll_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE RESTRICT
    FOREIGN KEY(parent_comment_id) REFERENCES poll_comment(poll_comment_id) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE TRIGGER trig_poll_comment_updated_at
    AFTER UPDATE ON poll_comment FOR EACH ROW
BEGIN
    UPDATE poll_comment SET updated_at = current_timestamp
        WHERE poll_comment_id = old.poll_comment_id;
END;
CREATE TABLE song_lyric_comment (
    song_lyric_comment_id INTEGER PRIMARY KEY,
    song_lyric_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    parent_comment_id INTEGER DEFAULT NULL,    
    FOREIGN KEY (song_lyric_id) REFERENCES song_lyric (song_lyric_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE RESTRICT
    FOREIGN KEY(parent_comment_id) REFERENCES song_lyric_comment(song_lyric_comment_id) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE TRIGGER trig_song_lyric_comment_updated_at
    AFTER UPDATE ON song_lyric_comment FOR EACH ROW
BEGIN
    UPDATE song_lyric_comment SET updated_at = current_timestamp
        WHERE song_lyric_comment_id = old.song_lyric_comment_id;
END;
CREATE TABLE wall_post (
    wall_post_id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,    
    wall_user_id INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wall_user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE TRIGGER trig_wall_post_updated_at
    AFTER UPDATE ON wall_post FOR EACH ROW
BEGIN
    UPDATE wall_post SET updated_at = current_timestamp
        WHERE wall_post_id = old.wall_post_id;
END;
CREATE TABLE wall_post_comment (
    wall_post_comment_id INTEGER PRIMARY KEY,
    wall_post_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    parent_comment_id INTEGER DEFAULT NULL,    
    FOREIGN KEY (wall_post_id) REFERENCES wall_post (wall_post_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE RESTRICT
    FOREIGN KEY(parent_comment_id) REFERENCES wall_post_comment(wall_post_comment_id) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE TRIGGER trig_wall_post_comment_updated_at
    AFTER UPDATE ON wall_post_comment FOR EACH ROW
BEGIN
    UPDATE wall_post_comment SET updated_at = current_timestamp
        WHERE wall_post_comment_id = old.wall_post_comment_id;
END;
CREATE TABLE emoji (
    emoji_id INTEGER PRIMARY KEY,
    description TEXT NOT NULL,
    text TEXT NOT NULL
);
CREATE TABLE wall_post_comment_like(
    wall_post_comment_like_id INTEGER PRIMARY KEY,
    wall_post_comment_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    emoji_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wall_post_comment_id) REFERENCES wall_post_comment (wall_post_comment_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (emoji_id) REFERENCES emoji (emoji_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (wall_post_comment_id, user_id)
);
CREATE TRIGGER trig_wall_post_comment_like_updated_at
    AFTER UPDATE ON wall_post_comment_like FOR EACH ROW
BEGIN
    UPDATE wall_post_comment_like SET updated_at = current_timestamp
        WHERE wall_post_comment_like_id = old.wall_post_comment_like_id;
END;
