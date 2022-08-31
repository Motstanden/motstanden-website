import { KeyValuePair } from "./KeyValuePair";

export interface NewEventData {
    title: string
    startDateTime: string,                      // YYYY-MM-DD HH:MM:SS
    endDateTime: string | null                  // YYYY-MM-DD HH:MM:SS      
    keyInfo: KeyValuePair<string, string>[]
    description: string                         // Html
}

export interface EventData extends NewEventData {
    eventId: number;
    
    createdByUserId: number
    createdByName: string
    createdAt: string;          // Format: 'YYYY-MM-DD HH-MM-SS'
    
    updatedByUserId: number
    updatedByName: string
    updatedAt: string          // Format: 'YYYY-MM-DD HH-MM-SS'

    isUpcoming: boolean
}