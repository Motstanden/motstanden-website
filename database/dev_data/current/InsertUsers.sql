-- New password hashes can be generated with the script ../scripts/js/CalcPasswordHash.js 
-- The script converts plain text to a safe hash that can be stored in the db.

INSERT INTO user_account(user_account_id, username, password) VALUES 
    (1, 'dev',  '$2b$15$YiXF8IAFULU5jhzpNPVZYO8V2miUM/sQ4N7c.vTOk7jGzBg9Riy/S'),    -- Username: dev,   Password: dev
    (2, 'dev2', '$2b$15$Tafm58PLfASLgT225lKJP.RK8M745mFwveve4t4GYUGgs55A0sGga')     -- Username: dev2,  Password: dev2