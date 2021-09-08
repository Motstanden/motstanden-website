#!/bin/bash
rm -fv motstanden_dev.db;
echo "Running: 01_initial.sql";
sqlite3 motstanden_dev.db < ./migrations/01_initial.sql;
echo "Running: 02_new_sheet_archive.sql"
sqlite3 motstanden_dev.db < ./migrations/02_new_sheet_archive.sql;
echo "Dumping schema -> schema.sql"
sqlite3 motstanden_dev.db .schema > schema.sql  
cd dev_data;
sh InsertData.sh 
cd ..;
