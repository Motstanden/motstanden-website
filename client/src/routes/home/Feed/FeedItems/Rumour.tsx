import { Box, Link, Stack } from "@mui/material"
import { Rumour } from "common/interfaces"
import { RumourFeedItem as RumourFeedItemType } from "common/types"
import { RumourList } from "src/routes/rumour/RumourPage"
import RumourIcon from '@mui/icons-material/Hearing'
import { Link as RouterLink } from "react-router-dom"

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
        <div>
            <Stack direction="row" 
                gap="11px"            
                sx={{
                    marginLeft: "-13px",
                    marginBottom: "5px",
                }}
            >
                <RumourIcon sx={{
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
                    {rumours.length === 1 ? "Rykte" : "Rykter"}
                </Link> 
            </Stack>
            <Box sx={{
                borderLeftStyle: "solid",
                borderLeftWidth: "6px",
                borderLeftColor: theme => theme.palette.divider,
                paddingLeft: "15px",
            }}>
                <div style={{
                    fontWeight: "bold",
                    fontSize: "small",
                    opacity: 0.8,
                    fontStyle: "italic",
                    marginBottom: "-10px",
                    marginLeft: "2px"
                }}>
                    Har du hørt at...
                </div>
                <RumourList 
                    rumours={rumours}
                    onItemChanged={onItemChanged}
                    />
            </Box>
        </div>
    )
}