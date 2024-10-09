import { Box } from "@mui/material"
import { QuoteFeedItem } from "common/types"
import dayjs from "dayjs"
import { NewlineText } from "src/routes/quotes/components/NewlineText"

export {
    Quote as QuoteFeedItem
}

function Quote({ data }: {data: QuoteFeedItem }) {
    return (
        <Box sx={{
            borderLeftStyle: "solid",
            borderLeftWidth: "4px",
            borderLeftColor: theme => theme.palette.divider,
            paddingLeft: "15px",
        }}>
            <NewlineText text={data.quote} />
            <div style={{
                marginLeft: "20px",
                marginTop: "2px",
                opacity: 0.6,
                fontSize: "small",
                fontWeight: "bold",
                display: "flex",
                gap: "1ch"
            }}>
                <div>
                    –
                </div>
                <div>
                    {`${data.utterer}, ${dayjs.utc(data.modifiedAt).tz().format("D MMMM YYYY")}`}
                </div>
            </div>
        </Box>
    )
}