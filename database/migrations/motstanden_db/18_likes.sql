-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('17_likes.sql');


CREATE TABLE emoji (
    emoji_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    text TEXT NOT NULL
);

INSERT INTO 
    emoji(emoji_id, text, name)
VALUES
    (1, '👍', 'thumb'),
    (2, '💚', 'heart'),
    (3, '😆', 'laugh'),
    (4, '😮', 'surprised'),
    (5, '😢', 'sad'),
    (6, '😠', 'angry');

CREATE TABLE wall_post_comment_like(
    wall_post_comment_like_id INTEGER PRIMARY KEY,
    wall_post_comment_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    emoji_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wall_post_comment_id) REFERENCES wall_post_comment (wall_post_comment_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (emoji_id) REFERENCES emoji (emoji_id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (wall_post_comment_id, user_id)
);