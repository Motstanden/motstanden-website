import { DbWriteAction } from "../enums/DbWriteAction.js"

export type UpsertDb = DbWriteAction.Update | DbWriteAction.Insert