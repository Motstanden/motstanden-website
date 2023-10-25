import { LikeEntityType } from "common/enums";
import { Like } from "common/interfaces";

function getAll(entityType: LikeEntityType, entityId: number): Like[] { 
    throw "not implemented"
}

export const likesService = { 
    getAll: getAll
}