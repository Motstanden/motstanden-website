import { useMemo, useState } from "react"
import { useDebounce } from "./useDebounce"

type InitialValueType<T> = T | (() => T);

type StorageType<T> = [
    T, 
    React.Dispatch<React.SetStateAction<T>>, 
    VoidFunction
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValidateStorageFunction = (value: any) => boolean;

export type StorageKeyArray = (string | number)[];

export type StorageKey = string | StorageKeyArray;

interface StorageProps<T> {
    key: StorageKey,
    initialValue: InitialValueType<T>,
    validateStorage?: ValidateStorageFunction,
    delay?: number,
    serialize?: (value: T) => string,
    deserialize?: (value: string) => T,
}

interface ExtendedStorageProps<T> extends StorageProps<T> { 
    storage: Storage
}

const DEBOUNCE_DELAY = 500;

// A custom hook that uses either localStorage or sessionStorage to store and retrieve data
function useStorage<T>( {key: rawKey, initialValue, storage, ...options}: ExtendedStorageProps<T>): StorageType<T> {

    const key = useMemo(() => {
        return Array.isArray(rawKey) ? JSON.stringify(rawKey) : rawKey;
    }, [rawKey])

    const [isClearing, setIsClearing] = useState(false);

    // Get the stored value from the storage or use the initial value
    const [storedValue, setStoredValue] = useState<T>(() => {

        const initialVal = initialValue instanceof Function 
            ? initialValue() 
            : initialValue;
        const storageValue = getStoredItem<T>(storage, key, initialVal, options?.deserialize, options?.validateStorage)

        if (storageValue !== null){
            return storageValue
        } else {
            return initialVal
        }
    });
    
    // Save to storage when the stored value changes
    useDebounce(() => {
        if(!isClearing) {
            setStorageItem(storage, key, storedValue, options?.serialize)
        } else {
            setIsClearing(false);
        }
    }, options.delay ?? DEBOUNCE_DELAY, [storedValue])

    const clearStorage = () => {
        setIsClearing(true)
        storage.removeItem(key);
    }

    // Return the stored value and the setter function
    return [storedValue, setStoredValue, clearStorage];
}

/** 
 * Utility function to get a stored item from localStorage or sessionStorage.
 * @returns The stored item or null if it doesn't exist or is invalid. 
*/
function getStoredItem<T>(
    storage: Storage, 
    key: string,
    testObject: T,
    deserialize?: (value: string) => T, 
    validate?: ValidateStorageFunction
): T | null {
    const storageItem = storage.getItem(key);
    if (storageItem !== null) {

        let item: T;                          
        try {
            if(deserialize instanceof Function) {
                item = deserialize(storageItem);
            } else if (testObject instanceof Set) { 
                item = new Set(JSON.parse(storageItem)) as T;
            } else {
                item = JSON.parse(storageItem) as T;
            }
        } catch(err) {
            if(import.meta.env.PROD) {
                console.error(err)
                return null;
            } else {
                throw err;
            }
        }

        const isValid = validate ? validate(item) : true;

        if (isValid) {
            return item;
        }
    }
    return null;
}

function setStorageItem<T>(
    storage: Storage, 
    key: string, 
    value: T, 
    serialize?: (value: T) => string
) {
    let strValue;
    if(serialize){
        strValue = serialize(value);
    } else if (value instanceof Set) {
        strValue = JSON.stringify(Array.from(value));
    } else {
        strValue = JSON.stringify(value);
    }

    storage.setItem(key, strValue);
}

/**
 * A custom hook that uses localStorage to store and retrieve data. Works like useState but persists the state in localStorage.
 */
export function useLocalStorage<T>(props: StorageProps<T>): StorageType<T> {
    return useStorage({ ...props, storage: window.localStorage });
}

/**
 * A custom hook that uses sessionStorage to store and retrieve data. Works like useState but persists the state in sessionStorage.
 */
export function useSessionStorage<T>(props: StorageProps<T>): StorageType<T> {
    return useStorage({ ...props, storage: window.sessionStorage });
}
