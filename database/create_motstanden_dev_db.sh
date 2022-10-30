#!/bin/bash
rm -fv motstanden_dev.db;

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

# Insert data that is representative for the current data in the database
cd data/db
sh motstanden-db-data.sh 
cd ../..

echo "Dumping schema -> motstanden_schema.sql"
sqlite3 motstanden_dev.db .schema > motstanden_schema.sql 
