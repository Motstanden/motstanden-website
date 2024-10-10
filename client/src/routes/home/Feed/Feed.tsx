import { useQuery, useQueryClient } from "@tanstack/react-query"
import { FeedEntity } from "common/enums"
import { FeedItem as FeedItemType } from "common/types"
import { fetchFn } from "src/utils/fetchAsync"
import { QuoteFeedItem } from "./FeedItems/Quote"
import { FeedSkeleton } from "./FeedSkeleton"
import { NewUserFeedItem } from "./FeedItems/NewUser"
import { SongLyricFeedItem } from "./FeedItems/SongLyric"
import { RumourFeedItem } from "./FeedItems/Rumour"
import { PollFeedItem } from "./FeedItems/Poll"
import { WallPostFeedItem } from "./FeedItems/WallPost"
import { SimpleTextFeedItem } from "./FeedItems/SimpleText"
import { useMemo } from "react"

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
function groupFeedItems(items: FeedItemType[]): FeedItemType[][] {
    const result: FeedItemType[][] = []
    let currentGroup: FeedItemType[] = []

    for (const item of items) {
        if(isGroupedEntity(item.entity)) {      
            // If the current group is empty or the entity matches the current group, add to the current group
            if(currentGroup.length === 0 || currentGroup[0].entity === item.entity) {
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
    return entity === FeedEntity.NewUser ||
        entity === FeedEntity.Quote ||
        entity === FeedEntity.Rumour ||
        entity === FeedEntity.SongLyric ||
        entity === FeedEntity.SimpleText
}

function FeedItem( { item, onItemChanged }: { item: FeedItemType[], onItemChanged: VoidFunction } ) {

    if(item.length <= 0)
        return <></>

    switch(item[0].entity) { 
        case FeedEntity.NewUser:
            return <NewUserFeedItem data={item[0]}/>
        case FeedEntity.Quote: 
            return <QuoteFeedItem data={item} onItemChanged={onItemChanged}/>
        case FeedEntity.Rumour:
            return <RumourFeedItem data={item} onItemChanged={onItemChanged}/>
        case FeedEntity.SongLyric:
            return <SongLyricFeedItem data={item[0]}/>
        case FeedEntity.Poll:
            return <PollFeedItem data={item[0]}/>
        case FeedEntity.WallPost:
            return <WallPostFeedItem data={item[0]}/>
        case FeedEntity.SimpleText:
            return <SimpleTextFeedItem data={item[0]}/>
    }
}