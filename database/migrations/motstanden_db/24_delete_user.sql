PRAGMA foreign_keys = ON;

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('24_delete_user.sql');

-- Add columns: 
--      is_deleted 
--      deleted_at
ALTER TABLE user 
    ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT 0;

ALTER TABLE user
    ADD COLUMN deleted_at DEFAULT NULL CHECK(deleted_at = NULL OR deleted_at is datetime(deleted_at));


-- Change trigger: Update user.updated_at when user is updated and not deleted.
DROP TRIGGER trig_user_updated_at;

CREATE TRIGGER trig_user_updated_at
    AFTER UPDATE ON user FOR EACH ROW
BEGIN
    UPDATE user 
    SET updated_at = current_timestamp
    WHERE 
        user_id = OLD.user_id
        AND OLD.is_deleted = 0
        AND NEW.is_deleted = 0;
END;


-- New trigger: Set deleted_at when user is deleted.
CREATE TRIGGER trig_user_deleted
    AFTER UPDATE OF is_deleted ON user FOR EACH ROW
BEGIN
    UPDATE user
    SET 
        deleted_at = current_timestamp
    WHERE
        user_id = OLD.user_id
        AND OLD.is_deleted = 0
        AND NEW.is_deleted = 1;
END;
    

-- New trigger: Set deleted_at to NULL and updated_at when user is restored.
CREATE TRIGGER trig_user_restored
    AFTER UPDATE OF is_deleted ON user FOR EACH ROW
BEGIN
    UPDATE user 
    SET 
        deleted_at = NULL,
        updated_at = current_timestamp
    WHERE 
        user_id = OLD.user_id
        AND OLD.is_deleted = 1
        AND NEW.is_deleted = 0;
END;

-- Add fields to view vw_user:
--      is_deleted
--      deleted_at
DROP VIEW vw_user;
CREATE VIEW vw_user 
AS
SELECT
    user_id,
    user_group_id,
    user_group.name as user_group,
    user_rank_id,
    user_rank.name as user_rank,
    email,
    first_name,
    middle_name,
    last_name,
    full_name,
    cape_name,
    profile_picture,
    phone_number,
    birth_date,
    user_status.status as user_status,
    start_date,
    end_date,
    created_at,
    updated_at,
    is_deleted,
    deleted_at
FROM
    user
LEFT JOIN user_group USING (user_group_id)
LEFT JOIN user_rank USING (user_rank_id)
LEFT JOIN user_status USING (user_status_id);