PRAGMA foreign_keys = ON;

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('25_feed.sql');

CREATE VIEW vw_feed AS 
SELECT 
    'new-user' AS entity,
    user_id AS id,
    created_at AS modified_at,
    null AS modified_by,
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
    is_deactivated = 0 AND is_deleted = 0
UNION ALL
SELECT 
    'quote' AS entity,
    quote_id AS id,
    created_at AS modified_at,
    created_by AS modified_by,
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
-- New song lyrics
SELECT
    'song-lyric' AS entity,
    song_lyric_id AS id,
    created_at AS modified_at,
    created_by AS modified_by,
    null AS full_name,
    null AS quote,
    null AS utterer,
    null AS rumour,
    title,
    1 AS is_new,
    null AS type,
    null AS content,
    null AS wall_user_id,
    null AS key
FROM
    song_lyric
UNION ALL
-- Updated song lyrics
SELECT
    'song-lyric' AS entity,
    song_lyric_id AS id,
    updated_at AS modified_at,
    updated_by AS modified_by,
    null AS full_name,
    null AS quote,
    null AS utterer,
    null AS rumour,
    title,
    0 AS is_new,
    null AS type,
    null AS content,
    null AS wall_user_id,
    null AS key
FROM
    song_lyric
WHERE
    updated_by != created_by OR 
    updated_at > datetime(created_at, '+2 day')
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
    'wall-post' AS entity,
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
    'simple-text' AS entity,
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