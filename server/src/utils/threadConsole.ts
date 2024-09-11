import { parentPort } from 'node:worker_threads'

function log(string: string) {
    if(parentPort) {
        parentPort.postMessage(string)
    } else {
        console.log(string)
    }
}

export const threadConsole = {
    log
}