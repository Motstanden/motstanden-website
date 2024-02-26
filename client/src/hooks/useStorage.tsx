import { useState } from "react";

type InitialValueType<T> = T | (() => T);

type StorageType<T> = [
    T, 
    (value: InitialValueType<T>) => void, 
    VoidFunction
];

interface StorageOptions { 
    validateInitial?: (value: any) => boolean
}

// A custom hook that uses either localStorage or sessionStorage to store and retrieve data
function useStorage<T>(
    key: string, 
    initialValue: InitialValueType<T>, 
    storage: Storage,
    options?: StorageOptions
): StorageType<T> {

    // Get the stored value from the storage or use the initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        const item = getStoredItem(storage, key, options?.validateInitial)
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
        storage.setItem(key, JSON.stringify(value));
    };

    const clearStorage = () => {
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

/**
 * A custom hook that uses localStorage to store and retrieve data. Works like useState but persists the state in localStorage.
 */
export function useLocalStorage<T>(
    key: string, 
    initialValue: InitialValueType<T>,
    options?: StorageOptions
): StorageType<T> {
    return useStorage(key, initialValue, window.localStorage, options);
}

/**
 * A custom hook that uses sessionStorage to store and retrieve data. Works like useState but persists the state in sessionStorage.
 */
export function useSessionStorage<T>(
    key: string, 
    initialValue: InitialValueType<T>,
    options?: StorageOptions
): StorageType<T> {
    return useStorage(key, initialValue, window.sessionStorage, options);
}
