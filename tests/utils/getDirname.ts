import { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Get the dirname of the file that imports this function.
 * 
 * @param metaUrl The import.meta.url of the file that imports this function.
 * @returns The dirname of the file that imports this function.
 */
export function getDirname(metaUrl: string) {
    const __filename = fileURLToPath(metaUrl);
    return dirname(__filename);
}