# General

This project relies on two SQLite databases that exists independently:
1. `sheet_archive.db`
     - This database contains all data that is related to the sheet archive.
2. `motstanden.db`
     - This database contains all other data. 

# Folder Structure

## Migrations
### migrations/motstanden_db
 - Contains the entire schema history for both motstanden.db.
 - The current schema is generated by running all sql files in order.
 - The current schema is autogenerated and dumped into './motstanden_schemas.sql'

### migrations/sheet_archive_db
 - Same as *migrations/motstanden_db* **but with sheet_archive.db instead**. 
### Rules
 1. Every change in the database must be deployed through a migrations script.
 2. Once a migration script has been deployed, they should never change or be deleted.
 3. Always update the database version in new migrations scripts. Example for the file: 02_insert_sheet_archive_data.sql:
      ```
      INSERT INTO version(migration) VALUES 
      ('02_insert_sheet_archive_data.sql');
      ``` 

 ### Resources
  - Good practices: https://enterprisecraftsmanship.com/posts/database-versioning-best-practices/