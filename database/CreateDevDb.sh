#!/bin/bash
rm -fv motstanden_dev.db;
rm -fv sheet_archive_dev.db;

# First create the current database schema
echo "Running: 01_initial.sql";
sqlite3 motstanden_dev.db < ./migrations/01_initial.sql;

# Insert data that is representative for the current data in the database
cd dev_data/current;
sh InsertData.sh 
cd ../../;

# Refactor current tables
echo "Running: 02_refactor_db.sql"
sqlite3 motstanden_dev.db < ./migrations/02_refactor_db.sql;

# Create new sheet archive db
echo "Running: 03_new_sheet_archive.sql"
sqlite3 sheet_archive_dev.db < ./migrations/03_new_sheet_archive.sql;
echo "Running: 04_insert_sheet_archive_data.sql"
sqlite3 sheet_archive_dev.db < ./migrations/04_insert_sheet_archive_data.sql;


# Insert sheet archive data:
cp -r dev_data/files/* ../server/files/private/notearkiv/
cd scripts/js
node InsertSheetArchiveFiles.js ../../sheet_archive_dev.db ../../../server/files/private/notearkiv/
cd ../..


echo "Dumping schema -> motstanden_schema.sql"
sqlite3 motstanden_dev.db .schema > motstanden_schema.sql  
echo "Dumping schema -> sheet_archive_schema.sql"
sqlite3 sheet_archive_dev.db .schema > sheet_archive_schema.sql  
