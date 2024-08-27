import { sleepAsync } from "./sleepAsync.js"

type RetryResult<T> = {
    result: T ,
    error: undefined
} | {
    result: undefined,
    error: Error
}

type RetryFunction<T> = (() => Promise<T>) | (() => T)

/**
 * Try to run a function multiple times with an exponential delay between each try.
 * @returns The result of the function or an error if the function failed.
 */
export async function retry<T>({ 
    fn, 
    maxRetries = 3, 
    errorMessage = "Failed to execute function", 
    delayDampening = 1, 
    maxDelay = 5 * 1000 * 60
}: { 
    fn: RetryFunction<T>,
    maxRetries?: number,
    errorMessage?: string,
    delayDampening?: number
    maxDelay?: number
}): Promise<RetryResult<T>> {

    let retries = 0
    let internalError: Error | undefined

    while(retries < maxRetries) {
        try {
            const result = await fn()
            return { 
                result: result, 
                error: undefined 
            }

        } catch (error) {
            retries++
            internalError =  error instanceof Error ? error : new Error(String(error))

            const nextRetryMs = Math.min(maxDelay, Math.exp(retries * delayDampening) * 1000)
            if(retries < maxRetries) {
                console.warn(errorMessage, "Reason:", error, `Retrying in ${nextRetryMs}ms, [${retries}/${maxRetries}]`)
                await sleepAsync(nextRetryMs)
            } 
        }
    }

    return {
        result: undefined,
        error: new Error(errorMessage + 
            "\nReason: The retry loop reached max retries or was aborted." + 
            `\nInternal error: ${internalError?.message ?? "Never entered the retry loop."}`)
    }
}