PRAGMA foreign_keys = ON;

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('24_delete_user.sql');

-- Add columns: 
--      is_deactivated
--      is_deleted 
--      deactivated_at
--      deleted_at
ALTER TABLE user 
    ADD COLUMN is_deactivated BOOLEAN NOT NULL DEFAULT 0;

ALTER TABLE user 
    ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT 0;

ALTER TABLE user
    ADD COLUMN deactivated_at DEFAULT NULL CHECK(deactivated_at = NULL OR deactivated_at is datetime(deactivated_at));

ALTER TABLE user
    ADD COLUMN deleted_at DEFAULT NULL CHECK(deleted_at = NULL OR deleted_at is datetime(deleted_at));


-- New trigger: set deactivated_at when user is deactivated.
CREATE TRIGGER trig_user_deactivated
    AFTER UPDATE OF is_deactivated ON user 
    FOR EACH ROW
BEGIN
    UPDATE user
    SET 
        deactivated_at = current_timestamp
    WHERE
        user_id = OLD.user_id
        AND OLD.is_deactivated = 0
        AND NEW.is_deactivated = 1;
END;

-- New trigger: set deactivated_at to NULL when user is reactivated.
CREATE TRIGGER trig_user_reactivated
    AFTER UPDATE OF is_deactivated ON user 
    FOR EACH ROW
BEGIN
    UPDATE user
    SET 
        deactivated_at = NULL
    WHERE
        user_id = OLD.user_id
        AND OLD.is_deactivated = 1
        AND NEW.is_deactivated = 0;
END;


-- New trigger: Set deleted_at when user is deleted.
CREATE TRIGGER trig_user_deleted
    AFTER UPDATE OF is_deleted ON user 
    FOR EACH ROW
BEGIN
    UPDATE user
    SET 
        deleted_at = current_timestamp
    WHERE
        user_id = OLD.user_id
        AND OLD.is_deleted = 0
        AND NEW.is_deleted = 1;
END;
    

-- New trigger: Set deleted_at to NULL when user is undeleted.
CREATE TRIGGER trig_user_undeleted
    AFTER UPDATE OF is_deleted ON user FOR EACH ROW
BEGIN
    UPDATE user 
    SET 
        deleted_at = NULL
    WHERE 
        user_id = OLD.user_id
        AND OLD.is_deleted = 1
        AND NEW.is_deleted = 0;
END;

-- Add new fields to view vw_user:
--      is_deactivated
--      is_deleted
--      deactivated_at
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
    is_deactivated,
    is_deleted,
    created_at,
    updated_at,
    deactivated_at,
    deleted_at
FROM
    user
LEFT JOIN user_group USING (user_group_id)
LEFT JOIN user_rank USING (user_rank_id)
LEFT JOIN user_status USING (user_status_id);