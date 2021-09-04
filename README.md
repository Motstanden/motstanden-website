# Code of conduct
 - This project follows the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) guidelines. 
 - English should be used everywhere. Norwegian is not allowed.

# Setup
 - Make sure node version 16 is installed: https://nodejs.org/
    - Test that node is installed by running these commands from the command line:
        ```
        node --version
        npm --version
        ```
 - [ optional??? ] Make sure react is installed: https://reactjs.org/
 - Make sure all dependencies are installed by running these commands from the command line.
    ```
    cd client
    npm install
    cd ../server
    npm install
    ```
 - Make sure sqlite is installed: https://www.sqlite.org/download.html
 - Make sure sqlite command line is installed: https://www.sqlite.org/cli.html
 - Create a debug database by running the script: `./database/CreateDevDb.sh`. The script must be runned from a unix shell. I recommend using [git bash](https://gitforwindows.org/) on windows. Run script from terminal:
    ```
    sh CreateDevDb.sh
    ```
 - Create a .env file be running the script `./server/scripts/dev/js/GenerateEnvFile.js`
   - Copy the .env file to `./server`

# Project structure
## ./client
 - Contains the web page that is rendered on the users computer.
 - The web page is a single page react app.

 ### Useful commands

 - Install package dependencies: `npm install`
 - Start a development server: `npm start`
   - The dev server runs on: http://localhost:3000/
 - Build an optimized production ready release build:`npm run build`

 ## ./database
 - Contains all that is related to the database.
 - The database is build in sqlite 3.35

### Useful commands
 - Create a local development db: `sh CreateDevDb.sh` 

## ./server
 - Contains all code that is running locally on the server.
 - The server is running in node version 16.
 - The framework [express](https://expressjs.com/) is extensively used.
 - The server is running on: http://localhost:5000/

### Useful commands
 - Run a production like environment: `npm run dev`

# Resources
 ## Client
 - [React](https://reactjs.org/)
 ## Server
 - [node version 16](https://nodejs.org/)
 - [Express version 4](https://expressjs.com/)
 - [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3)

 ## Database 
 - [sqlite](https://www.sqlite.org/index.html)
 - [sqlite command line](https://www.sqlite.org/cli.html)