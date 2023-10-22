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