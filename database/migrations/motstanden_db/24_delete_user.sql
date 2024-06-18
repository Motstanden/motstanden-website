PRAGMA foreign_keys = ON;

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('24_delete_user.sql');

ALTER TABLE user 
    ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT 0;

ALTER TABLE user
    ADD COLUMN deleted_at DEFAULT NULL CHECK(deleted_at = NULL OR deleted_at is datetime(deleted_at));

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
