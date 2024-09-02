import Bree from 'bree'
import dotenv from "dotenv"
import { fileURLToPath } from 'node:url'

function resolvePath(relativePath: string) {
    return fileURLToPath(new URL(relativePath, import.meta.url))
}

dotenv.config({ path: resolvePath("../.env") })

const bree = new Bree({
    
    // Look for jobs to run in the `./jobs` folder
    root: resolvePath("jobs"),
    
    // Specify which time
    timezone: process.env.IS_DEV_ENV === "true" ? "local" : "Europe/Oslo",
    
    // Prevents jobs from running when the server starts up
    timeout: false,

    // Forcefully close a job after 1 hour. Something must be wrong if a job takes this long to complete.
    closeWorkerAfterMs: 1000 * 60 * 60,

    jobs: [
        // Runs `jobs/deleteDeactivatedUsers.js` every day at midnight
        {
            name: "deleteDeactivatedUsers",
            interval: "at 00:00",
            timeout: false,                 // <-- specify `false` here to prevent the job from running when the server starts up
        }
    ]
})

await bree.start();
