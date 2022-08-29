#!/bin/bash
cd ..

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


# Insert data that is representative for the current data in the database
pushd dev/data/sql-table-inserts > /dev/null
sh InsertData.sh 
popd > /dev/null

echo "Dumping schema -> motstanden_schema.sql"
sqlite3 motstanden_dev.db .schema > motstanden_schema.sql 

cd dev