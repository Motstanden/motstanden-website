-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('19_poll_voters_view.sql');

CREATE VIEW vw_poll_voter AS
SELECT 
	poll_vote_id,
	vote.updated_at as vote_updated_at,
	poll_id,
	poll_option_id,
	text as poll_option_text,
	user_id,
	first_name,
	middle_name,
	last_name,
	full_name
FROM 
	poll_vote vote
LEFT JOIN poll_option USING (poll_option_id)
LEFT JOIN user USING(user_id);
