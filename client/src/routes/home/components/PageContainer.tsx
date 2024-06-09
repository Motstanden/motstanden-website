import { Badge } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Count } from "common/interfaces";
import { useState } from "react";
import { Outlet, useMatch } from "react-router-dom";
import { useAppBarHeader } from "src/context/AppBarHeader";
import { useDebounce } from "src/hooks/useDebounce";
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer";
import { fetchFn } from "src/utils/fetchAsync";

export default function PageContainer() { 
    useAppBarHeader("Hjem")

    const { unreadCount, isUpdating, clearUnreadCount } = useUnreadWallPosts()

    const isWallPage = !!useMatch("/vegg")

    useDebounce( async () => {
        if(unreadCount > 0 && !isUpdating && isWallPage) {
            await clearUnreadCount()
        }
    }, 1000, [unreadCount, isUpdating, isWallPage])

    return (
        <TabbedPageContainer
            tabItems={[
                { to: "/hjem", label: "Oversikt" },
                { to: "/vegg", label: <WallLabel unreadPostsCount={unreadCount}/>}
            ]}
            matchChildPath={true}
        >
            <Outlet/>
        </TabbedPageContainer>
    )
}

function useUnreadWallPosts() {

    const queryKey = ["wall-posts", "unread", "count"]
    const { data, isPending, isError } = useQuery<Count>({
        queryKey: queryKey,
        queryFn: fetchFn("/api/wall-posts/unread/count"),
    })
    const unreadCount = data?.count ?? 0
    const isSuccess = !isPending && !isError

    const queryClient = useQueryClient()
    
    const [isPosting, setIsPosting] = useState(false)

    const clearUnreadCount = async () => { 
        if(isSuccess && unreadCount > 0 && !isPosting) {
            setIsPosting(true)
            await fetch("/api/wall-posts/unread/count/reset", { method: "POST" })
            await queryClient.invalidateQueries({queryKey: queryKey})
            setIsPosting(false)
        }
    }

    return {
        unreadCount,
        isUpdating: isPosting || !isSuccess,
        clearUnreadCount,
    }
}

function WallLabel( {unreadPostsCount}: {unreadPostsCount: number}){

    if (unreadPostsCount <= 0)
        return "Vegg"

    let positionRight: number
    let marginRight: number
    if(unreadPostsCount < 10) {
        positionRight = 20
        marginRight = positionRight + 12
    } else if (unreadPostsCount < 100) {
        positionRight = 23
        marginRight = positionRight + 14.5
    } else {
        positionRight = 25
        marginRight = positionRight + 17
    }

    return (
        <Badge 
            badgeContent={unreadPostsCount}
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