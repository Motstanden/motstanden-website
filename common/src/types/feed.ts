import { FeedEntity } from "../enums/FeedEntity.js"
import { PollType } from "../interfaces/Poll.js"

type BaseEntity = {
    entity: FeedEntity,
    id: number,
    modifiedAt: string,     // Format: 'yyyy-mm-dd hh:mm:ss'
}

type AuthoredEntity = {
    modifiedBy: number
}

type NewUserEntity = BaseEntity & {
    entity: FeedEntity.NewUser,
    fullName: string
}

type QuoteEntity = BaseEntity & {
    entity: FeedEntity.Quote,
    quote: string,
    utterer: string,
    isCreatedByCurrentUser: boolean,
}

type RumourEntity = BaseEntity & {
    entity: FeedEntity.Rumour,
    rumour: string
    isCreatedByCurrentUser: boolean,
}

type SongLyricEntity = BaseEntity & AuthoredEntity & {
    entity: FeedEntity.SongLyric,
    title: string,
    isNew: boolean
}

type PollEntity = BaseEntity & AuthoredEntity & {
    entity: FeedEntity.Poll,
    title: string,
    type: PollType,
}

type WallPostEntity = BaseEntity & AuthoredEntity & {
    content: string,
    wallUserId: number,
}

type SimpleTextEntity = BaseEntity & AuthoredEntity & {
    key: string
}

export type FeedItem = NewUserEntity |
    QuoteEntity |
    RumourEntity |
    SongLyricEntity |
    PollEntity |
    WallPostEntity |
    SimpleTextEntity
    
export {
    BaseEntity as BaseFeedItem,
    NewUserEntity as NewUserFeedItem,
    QuoteEntity as QuoteFeedItem,
    RumourEntity as RumourFeedItem,
    SongLyricEntity as SongLyricFeedItem,
    PollEntity as PollFeedItem,
    WallPostEntity as WallPostFeedItem,
    SimpleTextEntity as SimpleTextFeedItem
}