import { useState } from "react";
import { useDebounce } from "./useDebounce";

type InitialValueType<T> = T | (() => T);

type StorageType<T> = [
    T, 
    (value: InitialValueType<T>) => void, 
    VoidFunction
];

interface StorageProps<T> {
    key: string,
    initialValue: InitialValueType<T>,
    validateStorage?: (value: any) => boolean,
    delay: number 
}

interface ExtendedStorageProps<T> extends StorageProps<T> { 
    storage: Storage
}

// A custom hook that uses either localStorage or sessionStorage to store and retrieve data
function useStorage<T>( {key, initialValue, storage, ...options}: ExtendedStorageProps<T>): StorageType<T> {

    const [isClearing, setIsClearing] = useState(false);

    // Get the stored value from the storage or use the initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        const item = getStoredItem(storage, key, options?.validateStorage)
        if (item !== null){
            return item
        }

        if (initialValue instanceof Function)
            return initialValue();

        return initialValue;
    });
    
    // Define a function that updates the stored value and the storage
    const setValue = (newValue: T | (() => T)) => {
        const value = newValue instanceof Function ? newValue() : newValue;
        setStoredValue(value);
    };

    // Save to storage when the stored value changes
    useDebounce(() => {
        if(!isClearing) {
            storage.setItem(key, JSON.stringify(storedValue));
        } else {
            setIsClearing(false);
        }
    }, options.delay, [storedValue])

    const clearStorage = () => {
        setIsClearing(true)
        storage.removeItem(key);
    }

    // Return the stored value and the setter function
    return [storedValue, setValue, clearStorage];
}

/** 
 * Utility function to get a stored item from localStorage or sessionStorage.
 * @returns The stored item or null if it doesn't exist or is invalid. 
*/
function getStoredItem(
    storage: Storage, 
    key: string, 
    validate?: ((value: any) => boolean
)): any | null {
    const storageItem = storage.getItem(key);
    if (storageItem !== null) {
        const item = JSON.parse(storageItem);

        const isValid = validate ? validate(item) : true;

        if (isValid) {
            return item;
        }
    }
    return null;
}

const DEBOUNCE_DELAY = 500;

/**
 * A custom hook that uses localStorage to store and retrieve data. Works like useState but persists the state in localStorage.
 */
export function useLocalStorage<T>( {delay = DEBOUNCE_DELAY, ...props}: StorageProps<T>): StorageType<T> {
    return useStorage({ delay: delay, ...props, storage: window.localStorage });
}

/**
 * A custom hook that uses sessionStorage to store and retrieve data. Works like useState but persists the state in sessionStorage.
 */
export function useSessionStorage<T>({delay = DEBOUNCE_DELAY, ...props}: StorageProps<T>): StorageType<T> {
    return useStorage({ delay: delay, ...props, storage: window.sessionStorage });
}
