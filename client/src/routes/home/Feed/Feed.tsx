import { useQuery } from "@tanstack/react-query"
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

export function Feed() {

    return (
        <>
            <FeedFetcher/>
        </>
    )
}

function FeedFetcher() {
    const { isPending, isError, data, error } = useQuery<FeedItemType[]>({ 
        queryKey: ["feed"],
        queryFn: fetchFn("/api/feed"),
    })
    
    if(isPending) {
        return <FeedSkeleton/>
    }

    if(isError) {
        return <div>{`${error}`}</div>
    }

    return <FeedList items={data}/> 
}

function FeedList({ items }: { items: FeedItemType[] }) { 
    return (
        <div style={{
            maxWidth: "700px",
        }}>
            {items.map( item => (
                <div key={`${item.entity} ${item.id}`}
                    style={{
                        marginBottom: "30px",
                    }}
                >
                    <FeedItem item={item}/>
                </div>
            ))}
        </div>
    )
}

function FeedItem( { item }: { item: FeedItemType } ) {
    switch(item.entity) { 
        case FeedEntity.NewUser:
            return <NewUserFeedItem data={item}/>
        case FeedEntity.Quote: 
            return <QuoteFeedItem data={item}/>
        case FeedEntity.Rumour:
            return <RumourFeedItem data={item}/>
        case FeedEntity.SongLyric:
            return <SongLyricFeedItem data={item}/>
        case FeedEntity.Poll:
            return <PollFeedItem data={item}/>
        case FeedEntity.WallPost:
            return <WallPostFeedItem data={item}/>
        case FeedEntity.SimpleText:
            return <SimpleTextFeedItem data={item}/>
    }
}