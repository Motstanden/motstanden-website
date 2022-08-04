declare global {
    namespace NodeJS {
        interface ProcessEnv {
            IS_DEV_ENV: string
            ACCESS_TOKEN_SECRET: string
            REFRESH_TOKEN_SECRET: string;
            PORT?: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { }