#!/bin/bash
echo 

echo "------------------------------------"
echo "     Creating motstanden_dev.db     "
echo "------------------------------------"
sh create_motstanden_dev_db.sh
echo && echo

echo "------------------------------------"
echo "    Creating sheet_archive_dev.db   "
echo "------------------------------------"
sh create_sheet_archive_dev_db.sh
echo 
