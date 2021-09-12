#!/bin/bash

# TODO
echo "Inserting migration data into motstanden_dev.db:";
sqlite3 ../../motstanden_dev.db < NewContent.sql;
