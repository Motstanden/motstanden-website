
// Custom utility type that...
//      1. Adds all properties of type T
//      2. and sets the properties K to optional
//
//      Copied from: https://stackoverflow.com/questions/43159887/make-a-single-property-optional-in-typescript

/**
 * From T, extract all properties and make properties of K Optional
 *  */ 
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;