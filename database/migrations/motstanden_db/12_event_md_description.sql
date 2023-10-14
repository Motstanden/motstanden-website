-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('12_event_md_description.sql');


DROP VIEW vw_event;

ALTER TABLE event
RENAME COLUMN description_html TO description;

ALTER TABLE event
DROP COLUMN description_json;

-- Recreate the event view with the updated info
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