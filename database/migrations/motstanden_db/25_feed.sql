PRAGMA foreign_keys = ON;

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('25_feed.sql');

CREATE VIEW vw_feed AS 
SELECT 
    'newUser' AS entity,
    user_id AS id,
    created_at AS modified_at,
    null AS created_by,
    full_name,
    null AS quote,
    null AS utterer,
    null AS rumour,
    null AS title,
    null AS is_new,
    null AS type,
    null AS content,
    null AS wall_user_id,
    null AS key
FROM 
    user
WHERE 
    is_deactivated != 1 OR is_deleted != 1
UNION ALL
SELECT 
    'quote' AS entity,
    quote_id AS id,
    created_at AS modified_at,
    created_by AS created_by,
    null AS full_name,
    quote,
    utterer,
    null AS rumour,
    null AS title,
    null AS is_new,
    null AS type,
    null AS content,
    null AS wall_user_id,
    null AS key
FROM
    quote
UNION ALL
SELECT
    'rumour' AS entity,
    rumour_id AS id,
    created_at AS modified_at,
    created_by AS modified_by,
    null AS full_name, 
    null AS quote,
    null AS utterer,   
    rumour,
    null AS title,
    null AS is_new,
    null AS type,
    null AS content,
    null AS wall_user_id,
    null AS key
FROM
    rumour
UNION ALL
SELECT
    'songLyric' AS entity,
    song_lyric_id AS id,
    updated_at AS modified_at,
    updated_by AS modified_by,
    null AS full_name,
    null AS quote,
    null AS utterer,
    null AS rumour,
    title,
    CASE WHEN created_at = updated_at THEN 1 ELSE 0 END AS is_new,
    null AS type,
    null AS content,
    null AS wall_user_id,
    null AS key
FROM
    song_lyric
UNION ALL
SELECT
    'poll' AS entity,
    poll_id AS id,
    created_at AS modified_at,
    created_by AS modified_by,
    null AS full_name,
    null AS quote,
    null AS utterer,
    null AS rumour,
    title,
    null AS is_new,
    type,
    null AS content,
    null AS wall_user_id,
    null AS key
FROM
    poll
UNION ALL
SELECT 
    'wallPost' AS entity,
    wall_post_id AS id,
    created_at AS modified_at,
    created_by AS modified_by,
    null AS full_name,
    null AS quote,
    null AS utterer,
    null AS rumour,
    null AS title,
    null AS is_new,
    null AS type,
    content,
    wall_user_id,
    null AS key
FROM
    wall_post
UNION ALL
SELECT 
    'simpleText' AS entity,
    simple_text_id AS id,
    updated_at AS modified_at,
    updated_by AS modified_by,
    null AS full_name,
    null AS quote,
    null AS utterer,
    null AS rumour,
    null AS title,
    null AS is_new,
    null AS type,
    null AS content,
    null AS wall_user_id,
    key
FROM 
    simple_text;