import path from 'path';
import url from 'url';

// -------------------------------------------------------------
//                              USAGE
// -------------------------------------------------------------

// import { getCurrentDir, getCurrentFile } from './utils/pathHelper.js';
// const __dirname = getCurrentDir(import.meta.url);
// const __filename = getCurrentFile(import.meta.url);

// -------------------------------------------------------------

export function getCurrentDir(fileUrl) {
    const __filename = url.fileURLToPath(fileUrl);
    return path.dirname(__filename);
}

export function getCurrentFile(fileUrl) {
    return __filename = url.fileURLToPath(fileUrl);
}
