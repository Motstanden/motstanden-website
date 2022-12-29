# Summary
This is the source code for [https://motstanden.no/](https://motstanden.no/) <br/>
The project is licensed under the MÅKESODD v1 license. MÅKESODD v1 can be read on [our website](https://motstanden.no/lisens) and in [the license file](../LICENSE).  

# Code of conduct
  - This project follows the guidelines of [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). 
  - English should be used everywhere. Norwegian is not allowed.
  - It is allowed to write issues and pull requests in Norwegian.

# Getting started
Follow all the steps in [getting-started.md](./getting-started.md) to set up and run the website locally. <br/>
After completing the guide, you will have learned everything you need to know to start developing on the website.  

# Project structure

## [client](./../client)
  - Contains the web page that is rendered on the users computer.
  - The web page is a single page react app.
  - The project is generated using [vite](https://vitejs.dev/).

## [common](./../common)
  - Contains code that is shared between the [server](/server) and the [client](/client).
  - Used for sharing utility functions and TS structures such as Enum, Interface and Type. 

 ## [database](./../database)
  - Contains everything that is related to the database.
  - The database is build in sqlite 3.31

## [docs](./../docs)
  - Contains all documentation for the project.

## [server](./../server)
  - Contains all code that is running locally on the server.
  - The server is running in node version 18.
  - The framework [express](https://expressjs.com/) is extensively used.
  - The server is running on: [http://localhost:5000](http://localhost:5000). 

## [tests](./../tests)
  - Contains end-to-end tests.
  - The tests requires the website to be running on [http://localhost:3000](http://localhost:3000).
  - The tests uses the [Playwright framework](https://playwright.dev/)
