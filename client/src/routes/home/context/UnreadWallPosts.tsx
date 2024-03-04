import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Count } from "common/interfaces";
import { createContext, useContext, useState } from "react";
import { useAuthenticatedUser } from "src/context/Authentication";
import { useLocalStorage } from "src/hooks/useStorage";
import { fetchFn } from "src/utils/fetchAsync";


interface UnreadWallPostsContextType { 
    unreadPosts: number,
    clearUnreadPosts: (options?: clearUnreadPostsOptions) => Promise<void>  
}

type clearUnreadPostsOptions = {
    refetchData?: boolean
}

const UnreadWallPostsContext = createContext<UnreadWallPostsContextType>(null!)

export function useUnreadWallPosts() {
    return useContext(UnreadWallPostsContext)
}

const wallPostCountQueryKey = [ "wall-posts", "count" ]

function useFetchWallPostCount() {
    return useQuery<Count>({
        queryKey: wallPostCountQueryKey,
        queryFn: fetchFn("/api/wall-posts/all/count")
    })   
}

function useReadPosts() {
    const { user } = useAuthenticatedUser()
    const storageKey = [...wallPostCountQueryKey, "user-id", user.id]    // Support multiple users in same browser
    return useLocalStorage<undefined | number>({
        key: storageKey,     
        initialValue: undefined,
        validateStorage: (value) => typeof value === "number",
        delay: 0,
    })
}

function useUnreadPostsProvider(): UnreadWallPostsContextType {
    const [readPosts, setReadPosts] = useReadPosts()
    const { data, isPending, isError } = useFetchWallPostCount()
    
    const [isClearing, setIsClearing] = useState<boolean>(false)
    const queryClient = useQueryClient()

    const clearUnreadPosts = async (options?: clearUnreadPostsOptions) => {
        const refetch = options?.refetchData ?? false
        setIsClearing(true)
        if (refetch) {
            await queryClient.invalidateQueries({queryKey: wallPostCountQueryKey})
        }
        const newData = await queryClient.ensureQueryData<Count>({queryKey: wallPostCountQueryKey}) 
        setReadPosts(newData.count)     
        setIsClearing(false)
    }

    let unreadPosts: number = 0
    if(!isPending && !isError) {
        if(readPosts === undefined) {
            setReadPosts(data.count)
            unreadPosts = 0
        } else {
            unreadPosts = data.count - readPosts
            unreadPosts = Math.max(0, unreadPosts)  // Prevent negative numbers
        }
    }
    if(isClearing)
        unreadPosts = 0 // Optimistic clearing

    return {unreadPosts, clearUnreadPosts}
}

export function UnreadWallPostsProvider({ children }: { children: React.ReactNode }) {
    const contextValue = useUnreadPostsProvider()
    return (
        <UnreadWallPostsContext.Provider value={contextValue} >
            {children}
        </UnreadWallPostsContext.Provider>
    )
}