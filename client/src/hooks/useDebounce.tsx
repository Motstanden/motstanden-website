import { useEffect } from "react";
import useTimeout from "./useTimeout";

// Originally copied from: https://github.com/WebDevSimplified/useful-custom-react-hooks/blob/main/src/3-useDebounce/useDebounce.js
// I have converted it to typescript and modified it.

/**
 * A custom hook that debounces a callback.
 */
export function useDebounce<T>(callback: () => void | T, delay: number = 500, dependencies: any[] = []) {
    const { value, reset, clear } = useTimeout<T>(callback, delay)
    useEffect(reset, [...dependencies, reset])
    useEffect(clear, [])
    return value
}