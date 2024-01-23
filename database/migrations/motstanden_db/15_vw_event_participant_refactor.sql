PRAGMA foreign_keys = ON;

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('15_vw_event_participant_refactor.sql');

DROP VIEW vw_event_participant;

CREATE VIEW vw_event_participant
AS 
SELECT 
	event_id,
    user_id,
    user.first_name,
    user.middle_name,
    user.last_name,
    user.full_name,
    user.profile_picture,
    participation_status.status
FROM
	event_participant
LEFT JOIN user USING(user_id)
LEFT JOIN participation_status USING(participation_status_id);