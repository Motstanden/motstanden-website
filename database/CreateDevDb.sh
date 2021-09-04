#!/bin/bash
rm -fv motstanden_dev.db;
echo "Creating new db";
sqlite3 motstanden_dev.db < ./dev/CreateDb.sql;
echo "Inserting quotes";
sqlite3 motstanden_dev.db < ./dev/InsertQuotes.sql;
echo "Inserting users";
sqlite3 motstanden_dev.db < ./dev/InsertUsers.sql;
echo "Inserting documents";
sqlite3 motstanden_dev.db < ./dev/InsertDocuments.sql;
echo "Inserting sheet music";
sqlite3 motstanden_dev.db < ./dev/InsertSheets.sql;
echo "Inserting song lyrics";
sqlite3 motstanden_dev.db < ./dev/InsertLyrics.sql;
