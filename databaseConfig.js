require("dotenv").config()

module.exports =  {
        // Gets the secret content from the .env file
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE_NAME,
        ssl: {
            rejectUnauthorized: false
        }
}
