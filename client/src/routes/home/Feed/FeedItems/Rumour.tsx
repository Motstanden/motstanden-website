import { RumourFeedItem } from "common/types";
import dayjs from "dayjs"
import { NewlineText } from "src/routes/quotes/components/NewlineText"

export {
    Rumour as RumourFeedItem
}

function Rumour({ data }: {data: RumourFeedItem }) {
    return (
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <div style = {{
                fontSize: "small",
                opacity: 0.6,
                marginBottom: "5px"
            }}>
                Har du hørt at...
            </div>
            <NewlineText text={"- " + data.rumour} />
            <div style={{
                marginLeft: "30px",
                marginTop: "2px",
                opacity: 0.6,
                fontSize: "xx-small"
            }}>
                {`${dayjs.utc(data.modifiedAt).tz().format("D MMMM YYYY")}`}
            </div>
        </div>
    )
}