import { randomUUID } from "crypto"

export function randomString(name: string, maxChars?: number) {
	let value = `${name} id: ${randomUUID()}`
	if(maxChars) {
		value = value.slice(Math.max(0, value.length - maxChars)) 	// Prioritize end of string
	}
	return value
}