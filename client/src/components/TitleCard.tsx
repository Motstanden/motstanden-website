import { Divider, Paper, Skeleton, Stack, SxProps } from "@mui/material"

export function TitleCard({ 
    title, sx, children, paddingTop, menu, showMenu, noMenuMargin: noMenuMargin 
}: {
    title: string,
    children: React.ReactNode,
    sx?: SxProps,
    paddingTop?: number,
    menu?: React.ReactNode,
    showMenu?: boolean
    noMenuMargin?: boolean
}) {
    return (
        <Paper 
            sx={{ 
                p: 2,
                pt: "10px", 
                ...sx 
            }} 
            elevation={6}>
            <Stack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    minHeight: "45px",
                }}
            >
                <h3 style={{ margin: 0 }}>
                    {title}
                </h3>
                {showMenu == true && (
                    <div style={{
                        // Most menus have a padding of ~12px. This will align the menu with the divider line below
                        marginRight: noMenuMargin ? "0px" : "-12px"     
                    }}>
                        {menu}
                    </div>
                )}
            </Stack>
            <Divider sx={{mb: paddingTop ?? 2 }} />
            {children}
        </Paper>
    )
}

export function TitleCardSkeleton({ 
    children, 
    sx, 
    paddingTop, 
}: { 
    children?: React.ReactNode,
    sx?: SxProps, 
    paddingTop?: number 
}) { 
    return (
        <Paper sx={{ p: 2, ...sx }} elevation={6}>
            <Skeleton variant="text" width="150px" sx={{fontSize: "large"}} />
            <Divider sx={{ mt: 1.5, mb: paddingTop ?? 2 }} />
            {children}
        </Paper>
    )
}