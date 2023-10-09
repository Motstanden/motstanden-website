#!/bin/bash
echo "Inserting data into motstanden_dev.db:";

echo "    Inserting users";
sqlite3 ../../motstanden_dev.db < InsertUsers.sql;

echo "    Inserting quotes";
sqlite3 ../../motstanden_dev.db < InsertQuotes.sql;

echo "    Inserting documents";
sqlite3 ../../motstanden_dev.db < InsertDocuments.sql;

echo "    Inserting song lyrics";
sqlite3 ../../motstanden_dev.db < InsertLyrics.sql;

echo "    Inserting events";
sqlite3 ../../motstanden_dev.db < InsertEvents.sql;

echo "    Inserting rumours";
sqlite3 ../../motstanden_dev.db < insertRumours.sql;

echo "    Inserting polls";
sqlite3 ../../motstanden_dev.db < insertPolls.sql;