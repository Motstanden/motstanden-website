rm -fv motstanden.db;
echo "Creating new db"
sqlite3 motstanden.db < database/CreateDb.sql;
echo "Inserting data into db"
sqlite3 motstanden.db < database/InsertDBData.sql;