import { Descendant } from "../richTextSchema";
import { Optional } from "../types";
import { KeyValuePair } from "./KeyValuePair";

export interface NewEventData {
    title: string
    startDateTime: string,                      // YYYY-MM-DD HH:MM:SS
    endDateTime: string | null                  // YYYY-MM-DD HH:MM:SS      
    keyInfo: KeyValuePair<string, string>[]
    description: Descendant[]
    descriptionHtml: string
}

export interface UpsertEventData extends NewEventData, Partial<Pick<EventData, "eventId">> { }

export interface EventData extends Optional<NewEventData, "descriptionHtml"> {
    eventId: number;

    createdByUserId: number
    createdByName: string
    createdAt: string;          // Format: 'YYYY-MM-DD HH-MM-SS'

    updatedByUserId: number
    updatedByName: string
    updatedAt: string          // Format: 'YYYY-MM-DD HH-MM-SS'

    isUpcoming: boolean
}