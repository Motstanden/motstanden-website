#!/bin/bash

# Make sure to define IS_DEV_ENV before running this script
if [[ -z "${IS_DEV_ENV}" ]]; then
    echo "IS_DEV_ENV undefined, please set IS_DEV_ENV environment variable." 1>&2
    exit 1
fi

# Backup directory and database path id dependent on dev environment variable
if [[ ${IS_DEV_ENV} == "false" ]]; then
    DB_NAMES=( "motstanden.db" "sheet_archive.db" )
    BACKUP_PARENT_DIRECTORY="$PWD/../../backup"
else
    DB_NAMES=( "motstanden_dev.db" "sheet_archive_dev.db" )
    BACKUP_PARENT_DIRECTORY="$PWD/backup-dev"
fi

# Use date for unique identifier of backup
UNIQUE_IDENTIFIER=$(date +"%Y-%m-%d")

for name in ${DB_NAMES[@]}; do
    # Remove .db from name (used in folder for backups)
    BACKUP_DIR_NAME=$(echo $name | sed 's/\.db//')
    # Custom directory for the backups of each database
    BACKUP_DIRECTORY="$BACKUP_PARENT_DIRECTORY/$BACKUP_DIR_NAME"
    # Path to database that will be backed up
    DB_PATH="$PWD/$name"
    # Add unique identifier to backup-name
    BACKUP_NAME="$UNIQUE_IDENTIFIER-$name"
    # Path of backed up database
    BACKUP_PATH="$BACKUP_DIRECTORY/$BACKUP_NAME"
    # Create a backup folder if it does not already exist
    mkdir -p $BACKUP_DIRECTORY
    # Check if database-file exists
    if test -f "$DB_PATH"; then
        # Create backup of database 
        sqlite3 $DB_PATH ".backup $BACKUP_PATH"
        if [ $? -eq 0 ]; then #if success:
            echo "Created backup of $DB_PATH in $BACKUP_PATH"
        else
            echo "Failed to create backup of $DB_PATH" 1>&2
        fi
    else
        echo "$DB_PATH does not exist" 1>&2
    fi
done
