#!/bin/bash
rm -fv motstanden_dev.db;

# First create the current database schema
echo "Running: 01_initial.sql";
sqlite3 motstanden_dev.db < ./migrations/01_initial.sql;

# Insert data is representative for the current data in the database
cd dev_data/current;
sh InsertData.sh 
cd ../../;

# Apply schema migration
echo "Running: 02_new_sheet_archive.sql"
sqlite3 motstanden_dev.db < ./migrations/02_new_sheet_archive.sql;

# Insert data after migration
cd dev_data/migration;
sh InsertData.sh 
cd ../../;


echo "Dumping schema -> schema.sql"
sqlite3 motstanden_dev.db .schema > schema.sql  
