import dotenv from "dotenv"
import { fileURLToPath } from 'node:url'

function resolvePath(relativePath: string) {
    return fileURLToPath(new URL(relativePath, import.meta.url))
}

export function loadServerEnv() {
    dotenv.config({ path: resolvePath("../../server/.env") })
}