PRAGMA foreign_keys = ON;

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('21_unread_wall_posts_count.sql');

CREATE TABLE read_wall_posts_count (
    read_wall_posts_count_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TRIGGER trig_read_wall_posts_count_updated_at
    AFTER UPDATE ON read_wall_posts_count FOR EACH ROW
BEGIN
    UPDATE read_wall_posts_count SET updated_at = current_timestamp
        WHERE read_wall_posts_count_id = old.read_wall_posts_count_id;
END;

CREATE VIEW vw_unread_wall_posts_count AS
SELECT 
    user_id,
    (SELECT COUNT(*) FROM wall_post) - count AS count
FROM
    read_wall_posts_count;