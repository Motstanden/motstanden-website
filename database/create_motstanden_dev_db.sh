#!/bin/bash
echo Deleting old db data
rm -fv motstanden_dev.db;
rm -frv ../tests/storage-state   # Deleting the database will invalidate test accesstokens
echo 
# Create the first implementations of the db
echo "Running: 01_initial.sql";
sqlite3 motstanden_dev.db < migrations/motstanden_db/01_initial.sql;

# Refactor the db
echo "Running: 02_refactor_db.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/02_refactor_db.sql;

# Add user accounts
echo "Running: 03_user_accounts.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/03_user_accounts.sql;

# Remove obsolete tables
echo "Running: 04_remove_obsolete.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/04_remove_obsolete.sql;

# Fix quote trigger bug
echo "Running: 05_fix_quote_trigger.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/05_fix_quote_trigger.sql;

# Add event tables
echo "Running: 06_events.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/06_events.sql;

# Refactor event tables
echo "Running: 07_events_refactor.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/07_events_refactor.sql;

# Create rumours table
echo "Running: 08_rumours.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/08_rumours.sql;

# Change the way upcoming events are calculated
echo "Running: 09_vw_event_refactor.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/09_vw_event_refactor.sql;

# Create poll table
echo "Running: 10_poll.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/10_poll.sql;

# Use markdown for event descriptions
echo "Running: 11_poll_trigger_bugfixes.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/11_poll_trigger_bugfixes.sql;

# Use markdown for event descriptions
echo "Running: 12_event_md_description.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/12_event_md_description.sql;

# Use markdown for song lyrics
echo "Running: 13_lyric_md_content.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/13_lyric_md_content.sql;

# Insert data that is representative for the current data in the database
cd data/db
sh motstanden-db-data.sh 
cd ../..

echo "Dumping schema -> motstanden_schema.sql"
sqlite3 motstanden_dev.db .schema > motstanden_schema.sql 
