import RumourIcon from '@mui/icons-material/Hearing'
import { Box, Link, Paper, Stack } from "@mui/material"
import { Rumour } from "common/interfaces"
import { RumourFeedItem as RumourFeedItemType } from "common/types"
import { Link as RouterLink } from "react-router-dom"
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
        <Paper
            sx={{
                pt: 1.5,
                px: 1,
                borderRadius: "10px",
            }}
            variant="outlined"
        >
            <Stack direction="row" 
                gap="11px"            
                sx={{
                    marginBottom: "-7px",
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
                    Har du hørt at...
                </Link> 
            </Stack>
            <Box sx={{
                borderLeftStyle: "solid",
                marginLeft: "10px",
                borderLeftWidth: "6px",
                borderLeftColor: theme => theme.palette.divider,
                paddingLeft: "15px",
            }}>
                <RumourList 
                    rumours={rumours}
                    onItemChanged={onItemChanged}
                    itemSpacing={rumours.length < 3 ? "0px" : "10px"}
                    />
            </Box>
        </Paper>
    )
}