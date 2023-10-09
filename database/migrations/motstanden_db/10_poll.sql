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

CREATE TRIGGER trig_poll_updated_at
    AFTER UPDATE ON poll FOR EACH ROW
BEGIN
    UPDATE event SET updated_at = current_timestamp
        WHERE poll_id = old.poll_id;
END;

CREATE TABLE option (
	option_id INTEGER PRIMARY KEY,
	text TEXT NOT NULL,
	poll_id INTEGER NOT NULL,
	FOREIGN KEY (poll_id) REFERENCES poll (poll_id) ON DELETE CASCADE
);

CREATE TABLE vote (
	vote_id INTEGER PRIMARY KEY,
	option_id INTEGER NOT NULL,
	user_id INTEGER NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (option_id) REFERENCES option (option_id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TRIGGER trig_vote_updated_at
    AFTER UPDATE ON option FOR EACH ROW
BEGIN
    UPDATE event SET updated_at = current_timestamp
        WHERE vote_id = old.vote_id;
END;
