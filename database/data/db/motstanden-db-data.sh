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

echo "    Inserting rumours";
sqlite3 ../../motstanden_dev.db < InsertRumours.sql;

echo "    Inserting polls";
sqlite3 ../../motstanden_dev.db < InsertPolls.sql;

echo "    Inserting events";
sqlite3 ../../motstanden_dev.db < InsertEvents.sql;

echo "    Inserting simple text";
sqlite3 ../../motstanden_dev.db < InsertSimpleText.sql;

echo "    Inserting wall posts";
sqlite3 ../../motstanden_dev.db < InsertWallPosts.sql;

echo "    Inserting images";
sqlite3 ../../motstanden_dev.db < insertImages.sql;