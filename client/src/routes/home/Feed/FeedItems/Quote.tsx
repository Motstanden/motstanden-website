import { Box } from "@mui/material"
import { Quote } from "common/interfaces"
import { QuoteFeedItem as QuoteFeedItemType } from "common/types"
import { QuoteList } from "src/routes/quotes/ListPage"

export function QuoteFeedItem({ 
    data, 
    onItemChanged 
}: {
    data: QuoteFeedItemType[], 
    onItemChanged: VoidFunction
}) {
    
    const quotes: Quote[] = data.map((item) => ({ 
        ...item,
        createdAt: item.modifiedAt,
        updatedAt: item.modifiedAt,
    } satisfies Quote))
    
    return (
        <Box sx={{
            borderLeftStyle: "solid",
            borderLeftWidth: "6px",
            borderLeftColor: theme => theme.palette.divider,
            paddingLeft: "15px",
        }}>
            <QuoteList 
                quotes={quotes}
                onItemChanged={onItemChanged}
            />
        </Box>
    )
}