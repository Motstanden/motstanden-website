import React from "react"
import { PageContainer } from "../PageContainer" 
import { useQuery } from '@tanstack/react-query'
import { responseInterceptor } from "http-proxy-middleware"

export default function Lyric(){
    return (
        <PageContainer>
            <h1>Studenttraller</h1>
            <LyricList/>
        </PageContainer>
    )
}


function LyricList(){
    const {isLoading, isError, data, error} = useQuery(["lyrics"], fetchLyricData)
    
    if (isLoading) {
        return <span>Loading...</span>
      }
    
    if (isError) {
        return <span>{`${error}`}</span>
    }

    const lyricData = data as ILyricData[]
    return (
        <ul>
            {lyricData.map(lyric => (
                <li key={lyric.url}>
                    {lyric.title}
                </li>
            ))}
        </ul>
    )
}

async function fetchLyricData(): Promise<ILyricData[]> {
    const res = await fetch("api/song_lyric")
    if(!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
    }
    else {
        return await res.json() as ILyricData[];
    }
}

interface ILyricData {
    title: string,
    url: string,
    melody?: string,
    textOrigin?: string,
    description?: string
}