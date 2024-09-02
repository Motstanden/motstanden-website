import { fileURLToPath } from "url"

/**
 * Returns true if the file is being executed as a script. 
 * Return false if the file is being imported as a module.
 * @param fileUrl Use `import.meta.url`
 */
// Hopefully we won't need this helper in the future: https://github.com/nodejs/node/issues/49440
// Sigh... ESM is such a mess... ಠ╭╮ಠ
export function isMainModule(fileUrl: string) {
    return fileURLToPath(fileUrl)
        .toLowerCase()
        .endsWith(process.argv[1].toLowerCase())
}