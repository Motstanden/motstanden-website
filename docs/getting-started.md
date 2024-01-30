# Summary
This is a guide for setting up and running the website locally. <br/>
After completing this guide, you will have learned everything you need to know to start developing on the website. 

# Requirements
  The following programs must be installed and added to PATH.
  - [node 20](https://nodejs.org/)
      ```bash
      # Check which version is installed in your path
      node --version
      npm --version
      ```

  - [sqlite 3.38](https://www.sqlite.org/download.html) or later.
      ```bash
      # Check which version is installed in your path
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
      cd ..
      ```
      
  You should now see two new SQLite db files that are fully populated with data: `database/motstanden_dev.db` and `database/sheet_archive_dev.db`

  ## Create server environment
  Copy the example environment files.
  ```bash
  cp server/.env.example server/.env
  cp server/info-mail-key.json.example server/info-mail-key.json
  ```

  **Note:** Mail functionality does not work with this example file. If you want to use mail
  functionality, you must either request a secret OAuth2 from Motstanden, or generate a secret OAuth2 k
  for your own mail. 

# Start project
1. Install all dependencies 

    **On Windows**
    ```bash
    cd server
    npm run setup-win
    ```

    **On Linux**
    ```bash
    cd server
    npm run setup-linux
    ```

2. Run the project
    ```bash
    npm run dev
    ```

The terminal is now running two servers:
1. http://localhost:3000/ – A front end server, responsible for compiling react and provide front end dev tools. This server is only used in development.
2. http://localhost:5000/ - A back end server, responsible for handling API calls and serving files. This will be the actual server that is running in production.

You can now go to [http://localhost:3000/](http://localhost:3000/) and start developing.<br/>
To log in, enter one of the following email addresses and click the `DEV LOGG INN`-button. 
- contributor@motstanden.no
- editor@motstanden.no
- admin@motstanden.no
- superadmin@motstanden.no

# Testing

Run the end-to-end tests with these steps:
1. Ensure that the website is running on [http://localhost:3000/](http://localhost:3000/)
3. Copy the example environment files
    ```bash
    cp tests/.env.example tests/.env
    ```
4. Run tests
    ```bash
    # [Very slow] Run all tests in all browsers
    npx playwright test

    # [Moderate speed] Run all tests in firefox
    npx playwright test --project firefox

    # [Moderate speed] Run smoke tests in all browsers
    npx playwright test --grep "@smoke"   

    # [Very fast] Run smoke test only in firefox
    npx playwright test --grep "@smoke" --project firefox

    # [Pretty] Run and render smoke test in firefox
    npx playwright test --grep "@smoke" --project firefox --headed --workers 1
    ```
    Read more about testing in our [test documentation](./testing.md)
<br/>
<br/>

Now you have all the tools you need to start developing.<br/>
**Happy coding!**
