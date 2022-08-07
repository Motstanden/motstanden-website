-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('03_user_accounts.sql');

DROP TABLE user_account;

CREATE TABLE user_group (
    user_group_id INTEGER PRIMARY KEY NOT NULL,
    name TEXT UNIQUE NOT NULL
);

-- Suggestion for possible roles:
--      1, subscriber
--      2, contributor
--      3, author
--      4, editor,
--      5, administrator
--      6, super administrator
-- We only need 3 roles right now, so lets YAGNI it for now:
INSERT INTO 
    user_group(user_group_id, name)
VALUES
    (1, "contributor"),
    (2, "administrator"),
    (3, "super administrator");


CREATE TABLE user_rank (
    user_rank_id INTEGER PRIMARY KEY NOT NULL,
    name TEXT UNIQUE NOT NULL
);

INSERT INTO
    user_rank(user_rank_id, name)
VALUES
    (1, "kortslutning"),
    (2, "ohm"),
    (3, "kiloohm"),
    (4, "megaohm"),
    (5, "gigaohm"),
    (6, "høyimpedant");


CREATE TABLE user (
    user_id INTEGER PRIMARY KEY NOT NULL,
    user_group_id INTEGER NOT NULL DEFAULT 1,
    user_rank_id INTEGER NOT NULL DEFAULT 1,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT DEFAULT "",
    last_name TEXT NOT NULL,
    profile_picture TEXT NOT NULL CHECK(like('files/private/profilbilder/%_._%', profile_picture)) DEFAULT "files/private/profilbilder/boy.png",
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_group_id)
         REFERENCES user_group (user_group_id)
         ON UPDATE CASCADE
         ON DELETE RESTRICT,
    FOREIGN KEY (user_rank_id)
        REFERENCES user_rank (user_rank_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

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
    profile_picture,
    created_at
FROM
    user
LEFT JOIN user_group USING (user_group_id)
LEFT JOIN user_rank USING (user_rank_id);


INSERT INTO 
    user(user_id, user_group_id, user_rank_id, email, first_name, middle_name, last_name)
VALUES
    (1, 3, 4, 'web@motstanden.no',      "Web",      "", ""),
    (2, 2, 5, 'leder@motstanden.no',   "Leder",     "", ""),
    (3, 2, 4, 'okonomi@motstanden.no',  "Okonomi",  "", ""),
    (4, 2, 4, 'dirigent@motstanden.no', "Dirigent", "", ""),
    (5, 2, 4, 'pr@motstanden.no',       "PR",       "", "");
