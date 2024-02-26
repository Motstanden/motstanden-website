import { useState } from "react";

type InitialValueType<T> = T | (() => T);

type StorageType<T> = [
    T, 
    (value: InitialValueType<T>) => void, 
    VoidFunction
];

// A custom hook that uses either localStorage or sessionStorage to store and retrieve data
function useStorage<T>(
    key: string, 
    initialValue: InitialValueType<T>, 
    storage: Storage
): StorageType<T> {
    
    // Get the stored value from the storage or use the initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        const item = storage.getItem(key);

        if (item !== null)
            return JSON.parse(item);

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
 * A custom hook that uses localStorage to store and retrieve data. Works like useState but persists the state in localStorage.
 */
export function useLocalStorage<T>(
    key: string, 
    initialValue: InitialValueType<T>
): StorageType<T> {
    return useStorage(key, initialValue, window.localStorage);
}

/**
 * A custom hook that uses sessionStorage to store and retrieve data. Works like useState but persists the state in sessionStorage.
 */
export function useSessionStorage<T>(
    key: string, 
    initialValue: InitialValueType<T>
): StorageType<T> {
    return useStorage(key, initialValue, window.sessionStorage);
}
