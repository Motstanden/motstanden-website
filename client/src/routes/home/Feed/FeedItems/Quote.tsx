import { Box, Link, Paper } from "@mui/material"
import { Quote } from "common/interfaces"
import { QuoteFeedItem as QuoteFeedItemType } from "common/types"
import { QuoteList } from "src/routes/quotes/ListPage"
import { Link as RouterLink } from "react-router-dom"
import QuotesIcon from '@mui/icons-material/FormatQuote'

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
        <Paper
            sx={{
                pt: 1.5,
                px: 1,
                borderRadius: "10px",
            }}
            variant="outlined"
        >
            <QuotesIcon sx={{
                marginRight: "9px",
                marginBottom: "-7px",
                opacity: 0.8,
            }}/>
            <Link
                color="Inherit"
                component={RouterLink}
                to={`/sitater`}
                underline="hover"
                sx={{
                    fontWeight: "bold",
                    fontSize: "small",
                    opacity: 0.8,
                }}
            >
                {quotes.length === 1 ? "Sitat" : "Sitater"}
            </Link>  
            <Box sx={{
                mt: "-10px",
                marginLeft: "10px",                
                borderLeftStyle: "solid",
                borderLeftWidth: "6px",
                borderLeftColor: theme => theme.palette.divider,
                paddingLeft: "15px",
            }}>
                <QuoteList 
                    quotes={quotes}
                    onItemChanged={onItemChanged}
                    itemSpacing={quotes.length < 3 ? "0px" : "20px"}
                />
            </Box>
        </Paper>
    )
}