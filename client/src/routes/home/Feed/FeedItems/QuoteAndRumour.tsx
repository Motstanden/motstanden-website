import QuotesIcon from '@mui/icons-material/FormatQuote'
import RumourIcon from '@mui/icons-material/Hearing'
import { Paper } from "@mui/material"
import { FeedEntity } from "common/enums"
import { Quote, Rumour } from "common/interfaces"
import { QuoteFeedItem, RumourFeedItem } from "common/types"
import { useMemo } from "react"
import { QuoteList } from "src/routes/quotes/ListPage"
import { RumourList } from "src/routes/rumour/RumourPage"
import { InlineContent } from "../InlineContent"

export function QuoteAndRumourFeedItem({
    data,
    onItemChanged
}: {
    data: (QuoteFeedItem | RumourFeedItem)[],
    onItemChanged: VoidFunction
}) {

    const groupedData = useMemo(() => groupByEntity(data), [data])

    return (
        <Paper 
            sx={{
                py: 2,
                px: 1,
                borderRadius: "7px",
            }}
            variant="outlined"
        >
            {groupedData.map((items) => (
                <div key={`${items[0].entity} ${items[0].id}`}>

                    {items[0].entity === FeedEntity.Quote && (
                        <InlineContent 
                            title={items.length === 1 ? "Sitat" : "Sitater"}
                            href="/sitater"
                            icon={(
                                <QuotesIcon sx={{
                                    fontSize: "29px", 
                                    mb: "-5px",
                                    color: theme => theme.palette.text.secondary
                                }} />
                            )}
                            style={{
                                marginBottom: "15px",
                                rowGap: "10px",
                            }}
                        >
                            <Quotes 
                                data={items as QuoteFeedItem[]} 
                                onItemChanged={onItemChanged}
                            />
                        </InlineContent>
                    )}

                    {items[0].entity === FeedEntity.Rumour && (
                        <InlineContent 
                            title='Har du hørt at...'
                            href='/rykter'
                            icon={(
                                <RumourIcon sx={{
                                    fontSize: "26px", 
                                    ml: "-4px", 
                                    mb: "-5px", 
                                    color: theme => theme.palette.text.secondary
                                }}/>
                            )}
                            style={{
                                marginBottom: "15px",
                                rowGap: "10px",
                            }}
                        >
                            <Rumours 
                                data={items as RumourFeedItem[]} 
                                onItemChanged={onItemChanged}
                            />
                        </InlineContent>
                    )}
                </div>
            ))}
        </Paper>       
    )
}

function groupByEntity(items: (QuoteFeedItem | RumourFeedItem)[]) { 
    const result: (QuoteFeedItem | RumourFeedItem)[][] = []
    let currentGroup: (QuoteFeedItem | RumourFeedItem)[] = []

    for (const item of items) { 
        if(currentGroup.length === 0 || currentGroup[0].entity === item.entity) {
            currentGroup.push(item)
        } else {
            result.push(currentGroup)
            currentGroup = [item]
        }
    }

    if(currentGroup.length > 0) {
        result.push(currentGroup)
    }

    return result
}

function Quotes({ data, onItemChanged }: { data: QuoteFeedItem[], onItemChanged: VoidFunction }) { 
    const quotes: Quote[] = data.map((item) => ({ 
        ...item,
        createdAt: item.modifiedAt,
        updatedAt: item.modifiedAt,
    }) satisfies Quote)
    
    return (
        <div style={{
            marginBlock: "15px",
        }}>
            <QuoteList 
                quotes={quotes}
                onItemChanged={onItemChanged}
                itemSpacing="20px"
            />
        </div>
    )
}

function Rumours({ data, onItemChanged }: { data: RumourFeedItem[], onItemChanged: VoidFunction }) {   
    const rumours: Rumour[] = data.map((item) => ({
        ...item,
        createdAt: item.modifiedAt,
        updatedAt: item.modifiedAt,
    }) satisfies Rumour)

    return (
        <div style={{
            marginBlock: "15px", 
        }}>
            <RumourList 
                rumours={rumours}
                onItemChanged={onItemChanged}
                itemSpacing="15px"
            />
        </div>
    )
} 