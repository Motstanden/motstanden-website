import { Badge } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Count } from "common/interfaces";
import { useEffect } from "react";
import { Outlet, useMatch } from "react-router-dom";
import { useAppBarHeader } from "src/context/AppBarHeader";
import { useAuthenticatedUser } from "src/context/Authentication";
import { useDebounce } from "src/hooks/useDebounce";
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer";
import { fetchFn } from "src/utils/fetchAsync";

export default function PageContainer() { 
    useAppBarHeader("Hjem")
    useLocalStorageCleaner()    // Remove obsolete legacy data from local storage

    const { unreadCount, isUpdating, clearUnreadCount } = useUnreadWallPosts()
    const isWallPage = !!useMatch("/vegg")
    useDebounce(() => {
        if(unreadCount > 0 && !isUpdating && isWallPage) {
            clearUnreadCount()
        }
    }, 1500, [unreadCount, isUpdating, isWallPage])

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

    const queryClient = useQueryClient()
    
    const resetCount = useMutation({
        mutationFn: async () => {
            return await fetch("/api/wall-posts/unread/count/reset", { method: "POST" })
        },
        onSettled: async () => {
            return await queryClient.invalidateQueries({queryKey: queryKey})
        }
    })

    return {
        unreadCount,
        isUpdating: resetCount.isPending || isPending || isError,
        clearUnreadCount: resetCount.mutate,
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

// This hook removes obsolete legacy data from local storage.
// This hook can be deleted at some point in the future...
function useLocalStorageCleaner() {
    const { user } = useAuthenticatedUser()
    useEffect(() => {
        const keyData = ["wall-posts", "count", "user-id", user.id]
        const storageKey = JSON.stringify(keyData)
        window.localStorage.removeItem(storageKey)   
    }, [])
}