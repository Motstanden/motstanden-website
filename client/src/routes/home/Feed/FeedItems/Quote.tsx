import QuotesIcon from '@mui/icons-material/FormatQuote'
import { Quote } from "common/interfaces"
import { QuoteFeedItem as QuoteFeedItemType } from "common/types"
import { QuoteList } from "src/routes/quotes/ListPage"
import { InlinePaper } from "../InlinePaper"

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
        <InlinePaper 
            icon={<QuotesIcon sx={{
                fontSize: "29px", 
                mb: "-5px",
                color: theme => theme.palette.text.secondary
            }} />}
            title={quotes.length === 1 ? "Sitat" : "Sitater"}
            href="/sitater"
        >
            <QuoteList 
                quotes={quotes}
                onItemChanged={onItemChanged}
                itemSpacing={quotes.length < 3 ? "0px" : "20px"}
            />
        </InlinePaper>
    )
}