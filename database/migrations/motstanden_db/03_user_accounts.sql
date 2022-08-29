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
    (2, "editor"),
    (3, "administrator"),
    (4, "super administrator");


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


CREATE TABLE semester_name (
    semester_name_id INTEGER PRIMARY KEY NOT NULL,
    name TEXT UNIQUE NOT NULL 
);

CREATE TABLE user_status(
    user_status_id INTEGER PRIMARY KEY NOT NULL,
    status TEXT UNIQUE NOT NULL
);

INSERT INTO
    user_status(user_status_id, status)
VALUES
    (1, "Aktiv"),
    (3, "Veteran"),
    (2, "Pensjonist"),
    (4, "Inaktiv");

CREATE TABLE user (
    user_id INTEGER PRIMARY KEY NOT NULL,
    user_group_id INTEGER NOT NULL DEFAULT 1,
    user_rank_id INTEGER NOT NULL DEFAULT 1,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT NOT NULL DEFAULT "",
    last_name TEXT NOT NULL,
    cape_name TEXT NOT NULL DEFAULT "",
    phone_number INTEGER DEFAULT NULL CHECK(phone_number >= 10000000 AND phone_number <= 99999999),     -- Ensure number has 8 digits
    birth_date TEXT DEFAULT NULL CHECK(birth_date IS date(birth_date, '+0 days')),                      -- Check that format is 'YYYY-MM-DD'
    user_status_id INTEGER NOT NULL DEFAULT 1,
    start_date TEXT NOT NULL DEFAULT CURRENT_DATE CHECK(start_date IS date(start_date, '+0 days')),     -- Check that format is 'YYYY-MM-DD'
    end_date TEXT DEFAULT NULL CHECK(end_date IS date(end_date, '+0 days')),                            -- Check that format is 'YYYY-MM-DD'
    profile_picture TEXT NOT NULL CHECK(like('files/private/profilbilder/%_._%', profile_picture)) DEFAULT "files/private/profilbilder/boy.png",
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_group_id)
         REFERENCES user_group (user_group_id)
         ON UPDATE CASCADE
         ON DELETE RESTRICT,
    FOREIGN KEY (user_rank_id)
        REFERENCES user_rank (user_rank_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (user_status_id)
        REFERENCES user_status (user_status_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TRIGGER trig_user_updated_at
    AFTER UPDATE ON user FOR EACH ROW
BEGIN
    UPDATE user SET updated_at = current_timestamp
        WHERE user_id = old.user_id;
END;

-- TODO: Create a user_instrument table. 
--  * The tables will have a many to many relationship between user table and instrument table.
--  * The table needs to reference the sheet archive db.

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
    cape_name,
    profile_picture,
    phone_number,
    birth_date,
    user_status.status as user_status,
    start_date,
    end_date,
    created_at,
    updated_at
FROM
    user
LEFT JOIN user_group USING (user_group_id)
LEFT JOIN user_rank USING (user_rank_id)
LEFT JOIN user_status USING (user_status_id);

CREATE TABLE login_token (
    token_id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    issued_at INTEGER NOT NULL,
    expire_at INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE quote_new (
    quote_id INTEGER PRIMARY KEY NOT NULL,
    utterer TEXT NOT NULL,
    quote TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
        REFERENCES user (user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

INSERT INTO quote_new(quote_id, utterer, quote, user_id)
    SELECT quote_id, utterer, quote, 1 FROM quote; 

DROP TABLE quote;
ALTER TABLE quote_new RENAME TO quote;


-- DO NOT COPY THIS! It is broken!
-- The trigger is fixed in '05_fix_quote_trigger.sql'
CREATE TRIGGER trig_quote_updated_at
    AFTER UPDATE ON quote FOR EACH ROW
BEGIN
    UPDATE quote SET updated_at = current_timestamp
        WHERE user_id = old.user_id;                    
END;


INSERT INTO 
    user(user_id, user_group_id, user_rank_id, email, first_name, middle_name, last_name, start_date)
VALUES
    (1, 4, 4, 'web@motstanden.no',      "Web",      "", "Ω", "2018-09-11"),
    (2, 3, 5, 'leder@motstanden.no',    "Leder",    "", "Ω", "2018-09-11"),
    (3, 3, 4, 'okonomi@motstanden.no',  "Okonomi",  "", "Ω", "2018-09-11"),
    (4, 3, 4, 'dirigent@motstanden.no', "Dirigent", "", "Ω", "2018-09-11"),
    (5, 3, 4, 'pr@motstanden.no',       "PR",       "", "Ω", "2018-09-11");
