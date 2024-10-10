import { 
    FeedItem,
    NewUserFeedItem as NewUserFeedItemType, 
    SimpleTextFeedItem as SimpleTextFeedItemType, 
    SongLyricFeedItem as SongLyricFeedItemType 
} from "common/types"
import { InlinePaper } from "../InlinePaper"
import { FeedEntity } from "common/enums"
import { Link } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"

export type ActivityFeedItemType = NewUserFeedItemType |
    SimpleTextFeedItemType |
    SongLyricFeedItemType 

export function ActivityFeedItem({
    data
}: {
    data: ActivityFeedItemType[],
}) {
    return (
        <InlinePaper
            title="Aktivitet"
        >
            {data.map(item => (
                <ActivityItem key={`${item.entity} ${item.id}`} data={item} /> 
            ))}
        </InlinePaper>
    )
}

function ActivityItem({ data }: { data: ActivityFeedItemType }) {
    switch(data.entity) {
        case FeedEntity.NewUser:
            return <NewUserItem data={data}/>
        case FeedEntity.SimpleText:
            return <SimpleTextItem data={data}/>
        case FeedEntity.SongLyric:
            return <SongLyricItem data={data}/>
    }
}

function NewUserItem( { data }: { data: NewUserFeedItemType }) { 
    return (
        <div>
            <Link
                color="secondary"
                component={RouterLink}
                to={`/brukere/${data.id}`}
                underline="hover"
            >
                {data.fullName}
            </Link>   
            {` opprettet bruker! 🎉`}     
        </div>
    )   
}

function SimpleTextItem({ data }: { data: SimpleTextFeedItemType }) {
    return (
        <div>
            {data.key}
        </div>
    )
}

function SongLyricItem({ data }: { data: SongLyricFeedItemType }) {
    return (
        <div>
            {data.title}
        </div>
    )
}