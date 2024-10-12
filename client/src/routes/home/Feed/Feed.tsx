import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FeedEntity } from "common/enums"
import {
    FeedItem as FeedItemType,
    // NewUserFeedItem as NewUserFeedItemType,
    QuoteFeedItem as QuoteFeedItemType,
    RumourFeedItem as RumourFeedItemType,
} from "common/types"
import { useMemo } from "react"
import { fetchFn } from "src/utils/fetchAsync"
import { ActivityFeedItem, ActivityFeedItemType } from "./FeedItems/Activity"
import { PollFeedItem } from "./FeedItems/Poll"
import { QuoteAndRumourFeedItem } from "./FeedItems/QuoteAndRumour"
import { WallPostFeedItem } from "./FeedItems/WallPost"
import { FeedSkeleton } from "./FeedSkeleton"

export function Feed() {

    return (
        <>
            <FeedFetcher/>
        </>
    )
}

function FeedFetcher() {
    const queryKey = ["feed"]

    const { isPending, isError, data, error } = useQuery<FeedItemType[]>({ 
        queryKey: queryKey,
        queryFn: fetchFn("/api/feed"),
    })

    const queryClient = useQueryClient()
    const onItemChanged = () => { 
        queryClient.invalidateQueries({ queryKey: queryKey })
    }

    if(isPending) {
        return <FeedSkeleton/>
    }

    if(isError) {
        return <div>{`${error}`}</div>
    }

    return <FeedList items={data} onItemChanged={onItemChanged}/> 
}

function FeedList({ items, onItemChanged }: { items: FeedItemType[], onItemChanged: VoidFunction }) { 
    const groupedItems = useMemo(() => groupFeedItems(items), [items])

    return (
        <div style={{
            maxWidth: "700px",
        }}>
            {groupedItems.map( item => (
                <div key={`${item[0].entity} ${item[0].id}`}
                    style={{
                        marginBottom: "30px",
                    }}
                >
                    <FeedItem item={item} onItemChanged={onItemChanged}/>
                </div>
            ))}
        </div>
    )
}

/**
 * Groups consecutive items that should be rendered together in the UI. E.G. quotes, rumours, etc.
 * Items that should be rendered separately in the UI are not grouped. E.G. polls, wall posts, etc.
 * @returns An array of grouped items.
 */
// WARNING: 
//  <FeedItem/> blindly trusts that the output of this function is correct.
//  Be careful if you change this functions. Errors might not be caught by the type checker.
function groupFeedItems(items: FeedItemType[]): FeedItemType[][] {
    const result: FeedItemType[][] = []
    let currentGroup: FeedItemType[] = []

    for (const item of items) {
        if(isGroupedEntity(item.entity)) {      
            // If the current group is empty or the entity matches the current group, add to the current group
            if(currentGroup.length === 0 || isSameGroup(currentGroup[0].entity, item.entity)) {
                currentGroup.push(item)
            } else {
                // Save the current group and start a new one
                result.push(currentGroup)
                currentGroup = [item]
            }
        } else {
            // Save and delete the previous group
            if(currentGroup.length > 0) {
                result.push(currentGroup)
                currentGroup = []
            }
            result.push([item])
        }
    }

    if(currentGroup.length > 0) {
        result.push(currentGroup)
    }

    return result
}

/**
 * Check if consecutive items of this entity should be rendered as a group in the UI
 * @param entity The entity to check
 */
function isGroupedEntity( entity: FeedEntity): boolean {
    return entity === FeedEntity.Quote ||
        entity === FeedEntity.Rumour  ||      
        entity === FeedEntity.NewUser ||   
        entity === FeedEntity.SongLyric ||
        entity === FeedEntity.SimpleText
}

function isSameGroup(a: FeedEntity, b: FeedEntity): boolean { 
    if(a === b)
        return true

    if(isQuoteOrRumour(a) && isQuoteOrRumour(b))
        return true

    if(isActivityItem(a) && isActivityItem(b))
        return true

    return false
}

function isQuoteOrRumour(entity: FeedEntity) { 
    return entity === FeedEntity.Quote || 
        entity === FeedEntity.Rumour
}

function isActivityItem(entity: FeedEntity) { 
    return entity === FeedEntity.NewUser ||
        entity === FeedEntity.SimpleText ||
        entity === FeedEntity.SongLyric
}

function FeedItem( { item, onItemChanged }: { item: FeedItemType[], onItemChanged: VoidFunction } ) {

    if(item.length <= 0)
        return <></>

    // The type assertion should be safe here because the groupFeedItems function ensures that all items are of the same entity.
    // However, TypeScript doesn't know that, and it is really cumbersome to prove it to the type checker.
    // So we will just trust that the groupFeedItems function is correct and assert the type.
    switch(item[0].entity) { 
        case FeedEntity.Poll:
            return <PollFeedItem data={item[0]}/>
        case FeedEntity.WallPost:
            return <WallPostFeedItem data={item[0]}/>
        case FeedEntity.Quote: 
        case FeedEntity.Rumour:
            return <QuoteAndRumourFeedItem data={item as (QuoteFeedItemType | RumourFeedItemType)[]} onItemChanged={onItemChanged}/>
        case FeedEntity.NewUser:
        case FeedEntity.SongLyric:
        case FeedEntity.SimpleText:
            return <ActivityFeedItem data={item as ActivityFeedItemType[]}/>
    }
}