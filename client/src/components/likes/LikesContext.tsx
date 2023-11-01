import { useQuery } from "@tanstack/react-query"
import { LikeEntityType } from "common/enums"
import { Like } from "common/interfaces"
import React, { useEffect, useState } from "react"
import { fetchAsync } from "src/utils/fetchAsync"

export interface LikesContextType {
    isLoading: boolean,
    isError: boolean,
    entityType: LikeEntityType,
    entityId: number,
    queryKey: any[],
    likes: Like[]
}

const defaultLikesContext: LikesContextType = {
    isLoading: true,
    isError: false,
    entityType: null!,
    entityId: null!,
    queryKey: [],
    likes: []
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

    const [likesContext, setLikesContext] = useState<LikesContextType>({
        ...defaultLikesContext,
        entityId: entityId,
        entityType: entityType,
        queryKey: queryKey
    })

    const { isLoading, isError, data, error } = useQuery<Like[]>(queryKey, () => fetchAsync<Like[]>(url))

    useEffect(() => {
        setLikesContext( (oldVal) => ({
            ...oldVal,
            isError: isError,
            isLoading: isLoading,
            likes:  data ?? [],
        }))
    }, [isLoading, isError, data])

    return (
        <LikesContext.Provider value={likesContext}>
            {children}
        </LikesContext.Provider>        
    )
}