import Database from "better-sqlite3"
import { FeedEntity } from "common/enums"
import {
    BaseFeedItem,
    FeedItem,
    NewUserFeedItem,
    PollFeedItem,
    QuoteFeedItem,
    RumourFeedItem,
    SimpleTextFeedItem,
    SongLyricFeedItem,
    WallPostFeedItem
} from "common/types"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"

type DbBaseFeedItem = BaseFeedItem & { 
    modifiedBy: number | null
    fullName: null,
    quote: null,
    utterer: null,
    rumour: null,
    title: null,
    isNew: null,
    type: null,
    content: null,
    wallUserId: null,
    key: null,
}

type DbNewUserFeedItem = Omit<DbBaseFeedItem, keyof NewUserFeedItem> & NewUserFeedItem 
type DbWallPostFeedItem = Omit<DbBaseFeedItem, keyof WallPostFeedItem> & WallPostFeedItem
type DbSimpleTextFeedItem = Omit<DbBaseFeedItem, keyof SimpleTextFeedItem> & SimpleTextFeedItem

type DbQuoteFeedItem = Omit<DbBaseFeedItem, keyof QuoteFeedItem> & 
    Omit<QuoteFeedItem, "isCreatedByCurrentUser"> & {
    isCreatedByCurrentUser: 0 | 1
}
type DbRumourFeedItem = Omit<DbBaseFeedItem, keyof RumourFeedItem> & 
    Omit<RumourFeedItem, "isCreatedByCurrentUser"> & {
    isCreatedByCurrentUser: 0 | 1
}

type DbSongLyricFeedItem = Omit<DbBaseFeedItem, keyof SongLyricFeedItem> & 
    Omit<SongLyricFeedItem, "isNew"> & { 
    isNew: 0 | 1
}

type DbFeedItem = DbNewUserFeedItem |
    DbSongLyricFeedItem |
    DbWallPostFeedItem |
    DbSimpleTextFeedItem |
    DbQuoteFeedItem |
    DbRumourFeedItem

export function getFeed({
    limit,
    currentUserId,
}: {
    currentUserId: number
    limit?: number,
}): FeedItem[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            entity,
            id,
            modified_at as modifiedAt,
            modified_by as modifiedBy,
            full_name as fullName,
            quote,
            utterer,
            rumour,
            title,
            is_new as isNew,
            type,
            content,
            wall_user_id as wallUserId,
            key
        FROM
            vw_feed
        ${!!limit ? "LIMIT @limit" : ""}
        ORDER BY modified_at DESC
    `)
    const dbResult = stmt.all({limit: limit}) as DbFeedItem[] 
    db.close()
    const feed = dbResult.map((item) => convertFeedItem(item, currentUserId))
    return feed
}

function convertFeedItem(data: DbFeedItem, currentUserId: number) : FeedItem {
    const { entity } = data
    const baseProps: BaseFeedItem = {
        entity: entity,
        id: data.id,
        modifiedAt: data.modifiedAt
    }
    const authoredBaseProps = { 
        ...baseProps,
        modifiedBy: data.modifiedBy!
    }

    switch(entity) { 
        case FeedEntity.NewUser: 
            return { 
                ...baseProps,
                entity: FeedEntity.NewUser,
                fullName: data.fullName!,
            } satisfies NewUserFeedItem
        case FeedEntity.Quote: 
            return { 
                ...baseProps,
                entity: FeedEntity.Quote,
                quote: data.quote!,
                utterer: data.utterer!,
                isCreatedByCurrentUser: data.modifiedBy === currentUserId,
            } satisfies QuoteFeedItem
        case FeedEntity.Rumour: 
            return { 
                ...baseProps,
                entity: FeedEntity.Rumour,
                rumour: data.rumour!,
                isCreatedByCurrentUser: data.modifiedBy === currentUserId,
            } satisfies RumourFeedItem
        case FeedEntity.SongLyric: 
            return { 
                ...authoredBaseProps,
                entity: FeedEntity.SongLyric,
                title: data.title!,
                isNew: data.isNew === 1,
            } satisfies SongLyricFeedItem
        case FeedEntity.Poll:
            return {
                ...authoredBaseProps,
                entity: FeedEntity.Poll,
                title: data.title!,
                type: data.type!,
            } satisfies PollFeedItem
        case FeedEntity.WallPost:
            return {
                ...authoredBaseProps,
                entity: FeedEntity.WallPost,
                content: data.content!,
                wallUserId: data.wallUserId!,
            } satisfies WallPostFeedItem
        case FeedEntity.SimpleText:
            return {
                ...authoredBaseProps,
                entity: FeedEntity.SimpleText,
                key: data.key!,
            } satisfies SimpleTextFeedItem
        default: 
            throw new Error(`Not implemented conversion for entity: ${entity}`)
    }
}