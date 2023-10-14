-- Retroactively insert previous version into the DB.
INSERT INTO version(migration) VALUES
    ('10_poll.sql');

-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('11_poll_trigger_bugfixes.sql');

DROP TRIGGER trig_poll_updated_at;
CREATE TRIGGER trig_poll_updated_at
    AFTER UPDATE ON poll FOR EACH ROW
BEGIN
    UPDATE poll SET updated_at = current_timestamp
        WHERE poll_id = old.poll_id;
END;


DROP TRIGGER trig_poll_vote_updated_at;
CREATE TRIGGER trig_poll_vote_updated_at
    AFTER UPDATE ON poll_vote FOR EACH ROW
BEGIN
    UPDATE poll_vote SET updated_at = current_timestamp
        WHERE poll_vote_id = old.poll_vote_id;
END;