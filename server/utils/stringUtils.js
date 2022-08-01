
// Returns true if the input is a string and contains any non whitespace characters
export const stringIsNullOrWhiteSpace = (inputString) => {
    let result = true
    if (inputString) {                              // Check if value is defined
        if (typeof inputString === 'string') {      // Check if value is a string
            if (inputString.trim()) {               // Check if value contains any non white space characters
               result = false 
            }
        }
    }
    return result;
}
