-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('16_comment_section.sql');

-- Event comment section
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


-- Poll comment section
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

-- song_lyric comment section
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