import { Rumour } from "common/interfaces"
import { RumourFeedItem as RumourFeedItemType } from "common/types"
import { RumourList } from "src/routes/rumour/RumourPage"

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
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <RumourList 
                rumours={rumours}
                onItemChanged={onItemChanged}
                />
        </div>
    )
}