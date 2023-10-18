-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('09_vw_event_refactor.sql');

-- Change the way upcoming events are calculated
DROP VIEW vw_event;
CREATE VIEW vw_event
AS
SELECT
    event_id,
    title,
    start_date_time,
    end_date_time,
    key_info,
    description_html,
    description_json,
    created_by as created_by_user_id,
    created_by.full_name as created_by_full_name,
    e.created_at,
    updated_by as updated_by_user_id,
    updated_by.full_name as updated_by_full_name,
    e.updated_at,
    IIF( end_date_time is  NULL,
        IIF(datetime(start_date_time, 'start of day', '+1 day', '+6 hours') < datetime('now'), 0, 1),
        IIF(datetime(end_date_time, '+3 hours')   < datetime('now'), 0, 1)
    ) is_upcoming
FROM
    event e
LEFT JOIN user created_by
ON  created_by.user_id = e.created_by
LEFT JOIN user updated_by
ON  updated_by.user_id = e.updated_by;
