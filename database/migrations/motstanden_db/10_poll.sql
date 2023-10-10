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

CREATE TRIGGER trig_poll_vote_updated_at
    AFTER UPDATE ON poll_vote FOR EACH ROW
BEGIN
    UPDATE event SET updated_at = current_timestamp
        WHERE vote_id = old.vote_id;
END;

CREATE VIEW vw_poll_option AS
SELECT 
	o.poll_option_id,
	text,
	poll_id,
	COUNT(v.poll_option_id) as votes
FROM 
	poll_option o
LEFT JOIN poll_vote v ON o.poll_option_id = v.poll_option_id  
GROUP BY o.poll_option_id;

CREATE VIEW vw_poll AS
SELECT 
	poll_id,
	title,
	type,

	created_by as created_by_user_id,
    created_by.first_name || ' '
       || IIF(length(trim(created_by.middle_name)) = 0, '', created_by.middle_name || ' ')
       || created_by.last_name
       as created_by_full_name,
    p.created_at,
	
	updated_by as updated_by_user_id,
    updated_by.first_name || ' '
       || IIF(length(trim(updated_by.middle_name)) = 0, '', updated_by.middle_name || ' ')
       || updated_by.last_name
       as updated_by_full_name,
    p.updated_at
	
FROM 
	poll p
LEFT JOIN user created_by ON created_by.user_id = p.created_by
LEFT JOIN user updated_by ON updated_by.user_id = p.updated_by;

