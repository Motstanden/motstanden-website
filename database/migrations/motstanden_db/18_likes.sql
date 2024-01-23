PRAGMA foreign_keys = ON;

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('18_likes.sql');


CREATE TABLE emoji (
    emoji_id INTEGER PRIMARY KEY,
    description TEXT NOT NULL,
    text TEXT NOT NULL
);

INSERT INTO 
    emoji(emoji_id, text, description)
VALUES
    (1, '👍', 'liker'),
    (2, '💚', 'hjerte'),
    (3, '😆', 'haha'),
    (4, '😮', 'wow'),
    (5, '😢', 'trist'),
    (6, '😠', 'sint');

------- LIKES ON wall_post -------

CREATE TABLE wall_post_like(
    wall_post_like_id INTEGER PRIMARY KEY,
    wall_post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    emoji_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wall_post_id) REFERENCES wall_post (wall_post_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (emoji_id) REFERENCES emoji (emoji_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (wall_post_id, user_id)
);

CREATE TRIGGER trig_wall_post_like_updated_at
    AFTER UPDATE ON wall_post_like FOR EACH ROW
BEGIN
    UPDATE wall_post_like SET updated_at = current_timestamp
        WHERE wall_post_like_id = old.wall_post_like_id;
END;

------- LIKES ON wall_post_comment -------

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

------- LIKES ON event_comment -------

CREATE TABLE event_comment_like(
    event_comment_like_id INTEGER PRIMARY KEY,
    event_comment_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    emoji_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_comment_id) REFERENCES event_comment (event_comment_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (emoji_id) REFERENCES emoji (emoji_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (event_comment_id, user_id)
);

CREATE TRIGGER trig_event_comment_like_updated_at
    AFTER UPDATE ON event_comment_like FOR EACH ROW
BEGIN
    UPDATE event_comment_like SET updated_at = current_timestamp
        WHERE event_comment_like_id = old.event_comment_like_id;
END;

------- LIKES ON poll_comment -------

CREATE TABLE poll_comment_like(
    poll_comment_like_id INTEGER PRIMARY KEY,
    poll_comment_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    emoji_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poll_comment_id) REFERENCES poll_comment (poll_comment_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (emoji_id) REFERENCES emoji (emoji_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (poll_comment_id, user_id)
);

CREATE TRIGGER trig_poll_comment_like_updated_at
    AFTER UPDATE ON poll_comment_like FOR EACH ROW
BEGIN
    UPDATE poll_comment_like SET updated_at = current_timestamp
        WHERE poll_comment_like_id = old.poll_comment_like_id;
END;

------- LIKES ON song_lyric_comment -------

CREATE TABLE song_lyric_comment_like(
    song_lyric_comment_like_id INTEGER PRIMARY KEY,
    song_lyric_comment_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    emoji_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (song_lyric_comment_id) REFERENCES song_lyric_comment (song_lyric_comment_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (emoji_id) REFERENCES emoji (emoji_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (song_lyric_comment_id, user_id)
);

CREATE TRIGGER trig_song_lyric_comment_like_updated_at
    AFTER UPDATE ON song_lyric_comment_like FOR EACH ROW
BEGIN
    UPDATE song_lyric_comment_like SET updated_at = current_timestamp
        WHERE song_lyric_comment_like_id = old.song_lyric_comment_like_id;
END;
