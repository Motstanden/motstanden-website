import RumourIcon from '@mui/icons-material/Hearing'
import { Rumour } from "common/interfaces"
import { RumourFeedItem as RumourFeedItemType } from "common/types"
import { RumourList } from "src/routes/rumour/RumourPage"
import { InlinePaper } from '../InlinePaper'

export function RumourFeedItem({ 
    data, 
    onItemChanged 
}: {
    data: RumourFeedItemType[], 
    onItemChanged: VoidFunction 
}) {
    const rumours: Rumour[] = data.map((item) => ({
        ...item,
        createdAt: item.modifiedAt,
        updatedAt: item.modifiedAt,
    }) satisfies Rumour)

    return (
        <InlinePaper
            icon={<RumourIcon sx={{
                fontSize: "26px", 
                ml: "-4px", 
                mb: "-5px", 
                color: theme => theme.palette.text.secondary
            }}/>}
            title='Har du hørt at...'
            href='/rykter'
        >
            <RumourList 
                rumours={rumours}
                onItemChanged={onItemChanged}
                itemSpacing={rumours.length < 3 ? "0px" : "10px"}
            />
        </InlinePaper>
    )
}