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

    if (unreadPosts <= 0)
        return "Vegg"

    let positionRight: number
    let marginRight: number
    if(unreadPosts < 10) {
        positionRight = 20
        marginRight = positionRight + 12
    } else if (unreadPosts < 100) {
        positionRight = 23
        marginRight = positionRight + 14.5
    } else {
        positionRight = 25
        marginRight = positionRight + 17
    }

    return (
        <Badge 
            badgeContent={unreadPosts}
            color="secondary"
            max={99}
            sx={{
                ".MuiBadge-badge": {
                    right: `-${positionRight}px`,
                    top: "50%",
                },
                marginRight: `${marginRight}px`
            }}
            >
            Vegg
        </Badge>
    )
}