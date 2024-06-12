PRAGMA foreign_keys = ON;

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('22_unread_wall_posts_rewrite.sql');

-- Remove the old data, it is useless :(
DROP VIEW vw_unread_wall_posts_count;
DROP TRIGGER trig_read_wall_posts_count_updated_at;
DROP TABLE read_wall_posts_count;

CREATE TABLE unread_wall_post (
    unread_wall_post_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    wall_post_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (wall_post_id) REFERENCES wall_post (wall_post_id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (user_id, wall_post_id)
);

CREATE TRIGGER trig_unread_wall_post_updated_at
    AFTER UPDATE ON unread_wall_post FOR EACH ROW
BEGIN
    UPDATE unread_wall_post SET updated_at = current_timestamp
        WHERE unread_wall_post_id = old.unread_wall_post_id;
END;