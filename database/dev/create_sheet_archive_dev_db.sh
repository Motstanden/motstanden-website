#!/bin/bash
cd ..

rm -fv sheet_archive_dev.db;

# Create db
echo "Running: 01_initial.sql"
sqlite3 sheet_archive_dev.db < migrations/sheet_archive_db/01_initial.sql;
echo "Running: 02_insert_sheet_archive_data.sql"
sqlite3 sheet_archive_dev.db < migrations/sheet_archive_db/02_insert_sheet_archive_data.sql;

# Insert data:
cp -r dev/data/files/* ../server/files/private/notearkiv/
pushd scripts/js > /dev/null
node InsertSheetArchiveFiles.js ../../sheet_archive_dev.db ../../../server/files/private/notearkiv/
popd  > /dev/null

echo "Dumping schema -> sheet_archive_schema.sql"
sqlite3 sheet_archive_dev.db .schema > sheet_archive_schema.sql

cd dev