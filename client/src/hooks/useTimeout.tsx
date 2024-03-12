import { useCallback, useEffect, useRef, useState } from "react"


// Originally copied from: https://github.com/WebDevSimplified/useful-custom-react-hooks/blob/main/src/2-useTimeout/useTimeout.js
// I have converted to typescript and made minor adjustments.

/**
 * A custom hook that runs a callback after a specified delay.
 * @param callback  
 * @param delay 
 * @returns An object with a value, reset function and a clear function. The value is the result of the callback. The clear function cancels the timeout and the reset function resets the timeout.
 */
export default function useTimeout<T>(
    callback: () => void | T,
    delay: number
): {
    value: T | undefined,
    reset: () => void;
    clear: () => void
} {
    const [value, setValue] = useState<T | undefined>(undefined)
    const callbackRef = useRef<() => void | T>(callback)
    const timeoutRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    const set = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            const newValue = callbackRef.current() ?? undefined
            setValue(newValue)
        }, delay)
    }, [delay])

    const clear = useCallback(() => {
        timeoutRef.current && clearTimeout(timeoutRef.current)
    }, [])

    useEffect(() => {
        set()
        return clear
    }, [set, clear])

    const reset = useCallback(() => {
        clear()
        set()
    }, [set, clear])

    return {value, reset, clear }
}
