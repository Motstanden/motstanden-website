PRAGMA foreign_keys = ON;

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('23_unread_comments_rewrite.sql');

-- Remove the old data, it is useless :(
DROP VIEW vw_unread_comments_count;
DROP VIEW vw_comments_count;
DROP TRIGGER trig_read_comments_count_updated_at;
DROP TABLE read_comments_count;

-- Unread event comment
CREATE TABLE unread_event_comment (
    unread_event_comment_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    event_comment_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (event_comment_id) REFERENCES event_comment (event_comment_id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (user_id, event_comment_id)
);

CREATE TRIGGER trig_unread_event_comment_updated_at
    AFTER UPDATE ON unread_event_comment FOR EACH ROW
BEGIN
    UPDATE unread_event_comment SET updated_at = current_timestamp
        WHERE unread_event_comment_id = old.unread_event_comment_id;
END;


-- Unread poll comment
CREATE TABLE unread_poll_comment (
    unread_poll_comment_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    poll_comment_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (poll_comment_id) REFERENCES poll_comment (poll_comment_id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (user_id, poll_comment_id)
);

CREATE TRIGGER trig_unread_poll_comment_updated_at
    AFTER UPDATE ON unread_poll_comment FOR EACH ROW
BEGIN
    UPDATE unread_poll_comment SET updated_at = current_timestamp
        WHERE unread_poll_comment_id = old.unread_poll_comment_id;
END;

-- Unread song_lyric comment
CREATE TABLE unread_song_lyric_comment (
    unread_song_lyric_comment_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    song_lyric_comment_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (song_lyric_comment_id) REFERENCES song_lyric_comment (song_lyric_comment_id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (user_id, song_lyric_comment_id)
);

CREATE TRIGGER trig_unread_song_lyric_comment_updated_at
    AFTER UPDATE ON unread_song_lyric_comment FOR EACH ROW
BEGIN
    UPDATE unread_song_lyric_comment SET updated_at = current_timestamp
        WHERE unread_song_lyric_comment_id = old.unread_song_lyric_comment_id;
END;

-- Unread wall post comment
CREATE TABLE unread_wall_post_comment (
    unread_wall_post_comment_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    wall_post_comment_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (wall_post_comment_id) REFERENCES wall_post_comment (wall_post_comment_id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (user_id, wall_post_comment_id)
);

CREATE TRIGGER trig_unread_wall_post_comment_updated_at
    AFTER UPDATE ON unread_wall_post_comment FOR EACH ROW
BEGIN
    UPDATE unread_wall_post_comment SET updated_at = current_timestamp
        WHERE unread_wall_post_comment_id = old.unread_wall_post_comment_id;
END;