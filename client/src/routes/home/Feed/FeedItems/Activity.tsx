import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import LyricIcon from '@mui/icons-material/Nightlife'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Link, Skeleton, Stack } from "@mui/material"
import { FeedEntity } from "common/enums"
import {
    NewUserFeedItem as NewUserFeedItemType,
    SimpleTextFeedItem as SimpleTextFeedItemType,
    SongLyricFeedItem as SongLyricFeedItemType
} from "common/types"
import { Link as RouterLink } from "react-router-dom"
import { useUserReference } from "src/context/UserReference"
import { InlinePaper } from "../InlinePaper"

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
            icon={<TrendingUpIcon sx={{
                fontSize: "25px",
                marginBottom: "-3px",
                marginLeft: "2px",
                color: theme => theme.palette.text.secondary
            }} />}
        >
            <ul style={{
                listStyleType: "none",
                padding: 0,
            }}>
                {data.map( (item, index) => (
                    <li key={`${item.entity} ${item.id}`} 
                        style={{
                            marginBottom: index === data.length - 1 ? "0px" : "22px"
                        }}
                    >
                        <ActivityItem data={item} /> 
                    </li>
                ))}
            </ul>
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
            <Box sx={{
                minWidth: "32px",
                color: theme => theme.palette.text.disabled,
                display: "inline-block",
            }}>
                <PersonAddAltIcon fontSize="small" sx={{marginBottom: "-3px"}}/>
            </Box>
            <Link
                color="secondary"
                component={RouterLink}
                to={`/brukere/${data.id}`}
                underline="hover"
            >
                {data.fullName}
            </Link>   
            {` er lagt til som bruker! 🎉`}     
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
    
    const { isPending, isError, getUser } = useUserReference()

    if(isPending || isError) 
        return <Skeleton  />

    const user = getUser(data.modifiedBy)

    return (
        <Stack direction="row" >
            <Box sx={{ 
                minWidth: "32px",
                color: theme => theme.palette.text.disabled,
            }}>
                <LyricIcon fontSize="small"/>
                { data.isNew && (
                    <AddIcon 
                        sx={{
                            fontSize: "13px",
                            marginLeft: "-6px",
                            marginBottom: "-4px",
                        }}
                    /> 
                )}
                { !data.isNew && (
                    <EditIcon 
                        sx={{
                            fontSize: "11px",
                            marginLeft: "-7px",
                            marginBottom: "-3px",
                        }}
                    />
                )}
            </Box>
            <div>            
                <Link
                    color="secondary"
                    component={RouterLink}
                    to={`/brukere/${data.id}`}
                    underline="hover"
                >
                    {user.shortFullName}
                </Link>   
                { data.isNew === true  ? " opprettet " : " redigerte " }
                <Link
                    color={"secondary"}
                    component={RouterLink}
                    to={`/studenttraller/${data.id}`}
                    underline="hover"
                    sx={{
                        fontWeight: "bold",
                    }}
                >
                    {data.title}
                </Link>
            </div>
        </Stack>
    )
}