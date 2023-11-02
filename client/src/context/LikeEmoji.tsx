import { useQuery } from "@tanstack/react-query";
import { LikeEmoji } from "common/interfaces";
import React, { useEffect } from "react";
import { fetchAsync } from "src/utils/fetchAsync";
import { useAuth } from "./Authentication";

export interface LikeEmojiContextType { 
    emojis: Record<number, string>
}

const emptyLikeEmoji: LikeEmojiContextType = {
    emojis: {}
}

const LikeEmojiContext = React.createContext<LikeEmojiContextType>(emptyLikeEmoji);

export function useLikeEmoji() {
    return React.useContext(LikeEmojiContext)
}

export function LikeEmojiProvider( {children}: {children: React.ReactNode} ) {
    const user = useAuth().user
    const isEnabled = !!user    // The context is enabled if the user is logged in

    const [likeEmoji, setLikeEmoji] = React.useState<LikeEmojiContextType>(emptyLikeEmoji)

    const { data } = useQuery<LikeEmoji[]>(["like-emoji"], () => fetchAsync<LikeEmoji[]>("/api/likes/emojis/all"),{
        enabled: isEnabled
    })
    
    useEffect(() => { 
        const likeEmojiLookUpTable: Record<number, string> = {}
        if(data) {
            for(let emoji of data) {
                likeEmojiLookUpTable[emoji.id] = emoji.text
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