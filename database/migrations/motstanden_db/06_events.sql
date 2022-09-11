-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('06_events.sql');

CREATE TABLE event (
    event_id INTEGER PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    start_date_time TEXT NOT NULL CHECK(start_date_time is datetime(start_date_time)),                          -- yyyy-mm-dd hh:mm
    end_date_time TEXT DEFAULT NULL CHECK(end_date_time = NULL OR end_date_time is datetime(end_date_time)),    -- yyyy-mm-dd hh:mm
    key_info TEXT NOT NULL DEFAULT "[]" CHECK(json_valid(key_info) = 1),                                                                        -- Json array    
    description TEXT NOT NULL,                                                                                  -- Html
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(created_by)
        REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY(updated_by)
        REFERENCES user(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TRIGGER trig_event_updated_at
    AFTER UPDATE ON event FOR EACH ROW
BEGIN
    UPDATE event SET updated_at = current_timestamp
        WHERE event_id = old.event_id;
END;

CREATE TABLE participation_status (
    participation_status_id INTEGER PRIMARY KEY NOT NULL,
    status TEXT UNIQUE NOT NULL
);

INSERT INTO 
    participation_status(participation_status_id, status)
VALUES
    (1, "Deltar"),
    (2, "Deltar kanskje"),
    (3, "Deltar ikke");

CREATE TABLE event_participant (
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    participation_status_id INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (event_id)
        REFERENCES event (event_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (participation_status_id)
        REFERENCES participation_status (participation_status_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE VIEW vw_event
AS
SELECT
    event_id,
    title,
    start_date_time,
    end_date_time,
    key_info,
    description,
    created_by as created_by_user_id,
    created_by.first_name || ' '
        || IIF(length(trim(created_by.middle_name)) = 0, '', created_by.middle_name || ' ') 
        || created_by.last_name 
        as created_by_full_name,
    e.created_at,
    updated_by as updated_by_user_id,
    updated_by.first_name || ' '
        || IIF(length(trim(updated_by.middle_name)) = 0, '', updated_by.middle_name || ' ') 
        || updated_by.last_name 
        as updated_by_full_name,
    e.updated_at,
    IIF( end_date_time is  NULL,
        IIF(datetime(start_date_time) < datetime('now'), 0, 1),
        IIF(datetime(end_date_time)   < datetime('now'), 0, 1)
    ) is_upcoming
FROM 
    event e
LEFT JOIN user created_by
ON  created_by.user_id = e.created_by
LEFT JOIN user updated_by
ON  updated_by.user_id = e.updated_by;

CREATE VIEW vw_event_participant
AS 
SELECT 
	event_id,
	JSON_GROUP_ARRAY(JSON_OBJECT(
		'userId', 				user_id,
		'firstName', 			user.first_name,
		'middleName',			user.middle_name,
		'lastName',				user.last_name,
		'profilePicture',		user.profile_picture,
		'participationStatus',	participation_status.status
	)) AS participants
FROM
	event_participant
LEFT JOIN user USING(user_id)
LEFT JOIN participation_status USING(participation_status_id)
GROUP BY event_id;