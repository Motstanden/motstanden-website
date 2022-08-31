# Code of conduct
  - This project follows the guidelines of [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). 
  - English should be used everywhere. Norwegian is not allowed.


# Requirements
  The following programs must be installed and added to PATH.
  - [node 18](https://nodejs.org/)
      ```bash
      # Check which version is installed
      node --version
      npm --version
      ```

  - [sqlite 3.31](https://www.sqlite.org/download.html) or later.
      ```bash
      # Check which version is installed
      sqlite3 --version 
      ```


# Create the environment
  ## Create a SQLite database for development

  1. Copy dummy files into the directory where the node server expects to find files.
      ```bash 
      cp --recursive database/data/files/* server/files/
      ```

  2. Install tool dependencies

      ```bash
      cd database/tools/js
      npm install
      cd ../../..
      ```

      - This step might cause trouble for some developers because some systems may have difficulties installing `better-sqlite3`. You can troubleshoot this step by reading the documentation for the package:
          - https://github.com/WiseLibs/better-sqlite3
          - https://github.com/WiseLibs/better-sqlite3/blob/master/docs/troubleshooting.md

  3. Create databases, and populate them with data.<br/>
  **Note**: You need a unix shell for this step. If you are using windows, I recommend using [git bash](https://gitforwindows.org/).
      ```bash
      cd database
      sh ./create_all_dev_db.sh
      ```
      
  You should now see two new SQLite db files that are fully populated with data: `database/motstanden_dev.db` and `database/sheet_archive_dev.db`

  ## Create server environment
  1. Rename the sample environment file: `server/.env.sample` --> `server/.env` 

  2. Install dependencies
      ```bash
      cd server
      npm install
      ```

# Start project
   You will have to dedicate two terminals to run this project:

  ### Terminal 1
  This terminal is dedicated to compile TypeScript to JavaScript. The following script will start a file watcher that automatically compiles TS to JS. It will also print out **very useful error message** if you write bad TS.
  ```bash
  cd server
  npm run tsc-watch 
  ```
  You will now see two new directories: `server/build` and `common/build`

  ### Terminal 2
  Run start-up script
  ```bash
  cd server
  npm run dev
  ```
  The terminal is now running two servers:
  1. http://localhost:3000/ – A front end server, responsible for compiling react and provide front end dev tools. This server is only used in development.
  2. http://localhost:5000/ - A back end server, responsible for handling API calls and serving content. This server will be the actual server running in production.

You can now go to http://localhost:3000/ and start developing.<br/>
Happy coding!

# Project structure
 ## [database](/database)
  - Contains everything that is related to the database.
  - The database is build in sqlite 3.31

## [client](/client)
  - Contains the web page that is rendered on the users computer.
  - The web page is a single page react app.
  - The project is generated using [Create React App](https://github.com/facebook/create-react-app). See [doc/create-react-app.md](/doc/create-react-app.md)

## [server](/server)
  - Contains all code that is running locally on the server.
  - The server is running in node version 18.
  - The framework [express](https://expressjs.com/) is extensively used.
  - The server is running on: http://localhost:5000/

## [common](/common)
  - Contains code that is shared between the [server](/server) and the [client](/client)
  - Used for sharing utility functions and TS structures such as Enum, Interface and Type 


# Resources

## General
  - [TypeScript](https://www.typescriptlang.org/)
  
## Client
  - [React](https://reactjs.org/)

## Server
  - [node version 18](https://nodejs.org/)
  - [Express version 4](https://expressjs.com/)
  - [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3)

 ## Database 
 - [sqlite](https://www.sqlite.org/index.html)
 - [sqlite command line](https://www.sqlite.org/cli.html)