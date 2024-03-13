#!/bin/bash
rm -fv sheet_archive_dev.db;

# Create db
echo "Running: 01_initial.sql"
sqlite3 sheet_archive_dev.db < migrations/sheet_archive_db/01_initial.sql;
echo "Running: 02_insert_sheet_archive_data.sql"
sqlite3 sheet_archive_dev.db < migrations/sheet_archive_db/02_insert_sheet_archive_data.sql;

# Insert data:
cd tools/js/insertSheetArchiveFiles
node insertSheetArchiveFiles.js ../../../sheet_archive_dev.db ../../../../server/files/private/notearkiv/
cd ../../..

# Update the data:
cd data/db
sh sheet-archive-db-data.sh 
cd ../..

echo "Dumping schema -> sheet_archive_schema.sql"
sqlite3 sheet_archive_dev.db .schema > sheet_archive_schema.sql