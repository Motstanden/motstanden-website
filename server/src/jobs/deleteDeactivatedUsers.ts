import { parentPort } from 'node:worker_threads'
import { isMainModule } from '../utils/isMainModule.js'


function main() {
    console.log("Running job")

    // TODO

    parentPort?.postMessage("done")
}

if(isMainModule(import.meta.url)) {
    main()
}

export {
    main as job
}

