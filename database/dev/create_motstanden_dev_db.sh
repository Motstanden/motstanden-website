#!/bin/bash
cd ..

rm -fv motstanden_dev.db;

# First create the current database schema
echo "Running: 01_initial.sql";
sqlite3 motstanden_dev.db < migrations/motstanden_db/01_initial.sql;

# Insert data that is representative for the current data in the database
pushd dev/data/sql-table-inserts > /dev/null
sh InsertData.sh 
popd > /dev/null

# Refactor current tables
echo "Running: 02_refactor_db.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/02_refactor_db.sql;

# Add user accounts
echo "Running: 03_.user_accounts.sql"
sqlite3 motstanden_dev.db < migrations/motstanden_db/03_.user_accounts.sql;

echo "Dumping schema -> motstanden_schema.sql"
sqlite3 motstanden_dev.db .schema > motstanden_schema.sql 

cd dev