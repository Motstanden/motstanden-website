import { useQuery } from "@tanstack/react-query";
import { LikeEmoji } from "common/interfaces";
import React, { useEffect } from "react";
import { fetchFn } from "src/utils/fetchAsync";
import { usePotentialUser } from "./Authentication";

export interface LikeEmojiContextType { 
    emojis: Record<number, LikeEmoji>
}

const emptyLikeEmoji: LikeEmojiContextType = {
    emojis: {}
}

const LikeEmojiContext = React.createContext<LikeEmojiContextType>(emptyLikeEmoji);

export function useLikeEmoji() {
    return React.useContext(LikeEmojiContext)
}

export function LikeEmojiProvider( {children}: {children: React.ReactNode} ) {
    const { isLoggedIn } = usePotentialUser()

    const [likeEmoji, setLikeEmoji] = React.useState<LikeEmojiContextType>(emptyLikeEmoji)

    const { data } = useQuery<LikeEmoji[]>({
        queryKey: ["like-emoji"],
        queryFn: fetchFn<LikeEmoji[]>("/api/emojis"),
        enabled: isLoggedIn
    })

    useEffect(() => { 
        const likeEmojiLookUpTable: Record<number, LikeEmoji> = {}
        if(data) {
            for(const emoji of data) {
                likeEmojiLookUpTable[emoji.id] = emoji
            }
        }
        setLikeEmoji({
            emojis: likeEmojiLookUpTable
        })
    }, [data])

    return (
        <LikeEmojiContext.Provider value={likeEmoji}>
            {children}
        </LikeEmojiContext.Provider>
    )
}