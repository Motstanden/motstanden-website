#!/bin/bash
echo "Inserting data into sheet_archive_dev.db:";

echo "    Setting Repertoire";
sqlite3 ../../sheet_archive_dev.db < SetRepertoire.sql;