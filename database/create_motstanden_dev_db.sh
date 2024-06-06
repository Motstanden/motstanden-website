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

# Use markdown for song lyrics
echo "Running: 14_simple_text.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/14_simple_text.sql;

# Reimplement view of event participant table
echo "Running: 15_vw_event_participant_refactor.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/15_vw_event_participant_refactor.sql;

# Create comment section
echo "Running: 16_comment_section.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/16_comment_section.sql;

# Create a wall were users can post messages
echo "Running: 17_wall_post.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/17_wall_post.sql;

# Create a wall were users can post messages
echo "Running: 18_likes.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/18_likes.sql;

# Create a view to see what users have voted on in a poll.
echo "Running: 19_poll_voters_view.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/19_poll_voters_view.sql;

# Create table for storing the count of read comments for each user
echo "Running: 20_unread_comments_count.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/20_unread_comments_count.sql;

# Create table for storing the count of read wall posts each user
echo "Running: 21_unread_wall_posts_count.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/21_unread_wall_posts_count.sql;

# Insert data that is representative for the current data in the database
cd data/db
sh motstanden-db-data.sh 
cd ../..

echo "Dumping schema -> motstanden_schema.sql"
sqlite3 motstanden_dev.db .schema > motstanden_schema.sql 
