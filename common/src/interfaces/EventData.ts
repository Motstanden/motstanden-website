import { KeyValuePair } from "./index.js"

export interface NewEventData {
    title: string
    startDateTime: string,                      // YYYY-MM-DD HH:MM:SS
    endDateTime: string | null                  // YYYY-MM-DD HH:MM:SS      
    keyInfo: KeyValuePair<string, string>[]
    description: string
}

export interface UpsertEventData extends NewEventData, Partial<Pick<EventData, "id">> { }

export interface EventData extends NewEventData {
    id: number;

    createdBy: number
    createdByName: string
    createdAt: string;          // Format: 'YYYY-MM-DD HH-MM-SS'

    updatedBy: number
    updatedByName: string
    updatedAt: string          // Format: 'YYYY-MM-DD HH-MM-SS'

    isUpcoming: boolean
}