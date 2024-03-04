import { Badge } from "@mui/material";
import { Outlet } from "react-router-dom";
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer";
import { UnreadWallPostsProvider, useUnreadWallPosts } from "../context/UnreadWallPosts";

export default function PageContainer() { 
    return (
        <UnreadWallPostsProvider>
            <TabbedPageContainer
                tabItems={[
                    { to: "/hjem", label: "Hjem" },
                    { to: "/vegg", label: <WallLabel/>}
                ]}
                matchChildPath={true}
            >
                <Outlet/>
            </TabbedPageContainer>
        </UnreadWallPostsProvider>
    )
}

function WallLabel(){
    const { unreadPosts } = useUnreadWallPosts()
    return (
        <Badge 
            badgeContent={unreadPosts}
            color="secondary"
            max={99}
            sx={{
                ".MuiBadge-badge": {
                    right: -20,
                    top: "50%",
                }
            }}
            >
            Vegg
        </Badge>
    )
}