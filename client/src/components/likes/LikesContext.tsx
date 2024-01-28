import { useQuery } from "@tanstack/react-query"
import { LikeEntityType } from "common/enums"
import { Like } from "common/interfaces"
import React, { useEffect, useState } from "react"
import { useAuth } from "src/context/Authentication"
import { fetchAsync, fetchFn } from "src/utils/fetchAsync"

interface GroupedLike {
    emojiId: number 
    count: number
}

export interface LikesContextType {
    isPending: boolean
    isError: boolean
    entityType: LikeEntityType
    entityId: number
    queryKey: any[]
    likes: Like[]
    groupedLikes: GroupedLike[]
    selfLike?: Like
}

const defaultLikesContext: LikesContextType = {
    isPending: true,
    isError: false,
    entityType: null!,
    entityId: null!,
    queryKey: [],
    likes: [],
    groupedLikes: []
}

const LikesContext = React.createContext<LikesContextType>(defaultLikesContext)

export function useLikes() {
    return React.useContext(LikesContext)
}

export function LikesContextProvider( {
    entityId,
    entityType,
    children
}: {
    entityId: number,
    entityType: LikeEntityType,
    children: React.ReactNode
}) {
    const queryKey = ["likes", entityType, entityId]
    const url = `/api/${entityType}/${entityId}/likes`

    const userId = useAuth().user?.id ?? -1

    const [likesContext, setLikesContext] = useState<LikesContextType>({
        ...defaultLikesContext,
        entityId: entityId,
        entityType: entityType,
        queryKey: queryKey
    })

    const { isPending, isError, data, error } = useQuery<Like[]>({
        queryKey: queryKey,
        queryFn: fetchFn<Like[]>(url)
    })

    useEffect(() => {
        setLikesContext( (oldVal) => ({
            ...oldVal,
            isError: isError,
            isPending: isPending,
            likes:  data ?? [],
            groupedLikes: groupAndSort(data ?? []),
            selfLike: data?.find(like => like.userId === userId)
        }))
    }, [isPending, isError, data])

    return (
        <LikesContext.Provider value={likesContext}>
            {children}
        </LikesContext.Provider>        
    )
}

function groupAndSort(likes: Like[]): GroupedLike[] { 
    const groupedLikes: GroupedLike[] = []

    for(let i = 0; i < likes.length; i++) {
        const like = likes[i]
        const group = groupedLikes.find(groupedLike => groupedLike.emojiId === like.emojiId)
        if(group) {
            group.count++
        } else {
            groupedLikes.push({emojiId: like.emojiId, count: 1})
        }
    }

    return groupedLikes.sort((a, b) => b.count - a.count)
}