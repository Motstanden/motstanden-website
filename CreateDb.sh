rm -fv motstanden.db;
echo "Creating new db"
sqlite3 motstanden.db < database/CreateDb.sql;
echo "Inserting quotes"
sqlite3 motstanden.db < database/InsertQuotes.sql;
echo "Inserting users"
sqlite3 motstanden.db < database/InsertUser.sql;
