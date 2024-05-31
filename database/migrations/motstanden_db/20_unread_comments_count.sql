PRAGMA foreign_keys = ON;

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('20_unread_comments_count.sql');

CREATE TABLE read_comments_count (
    read_comments_count_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TRIGGER trig_read_comments_count_updated_at
    AFTER UPDATE ON read_comments_count FOR EACH ROW
BEGIN
    UPDATE read_comments_count SET updated_at = current_timestamp
        WHERE read_comments_count_id = old.read_comments_count_id;
END;

CREATE VIEW vw_comments_count AS
SELECT
    (SELECT COUNT(*) FROM event_comment) +
    (SELECT COUNT(*) FROM poll_comment) +
    (SELECT COUNT(*) FROM song_lyric_comment) +
    (SELECT COUNT(*) FROM wall_post_comment)
AS count;

CREATE VIEW vw_unread_comments_count AS
SELECT 
    user_id,
    (SELECT count FROM vw_comments_count) - count AS count
FROM 
    read_comments_count;