import React from "react"
import { PageContainer } from "../PageContainer" 
import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom"


export function LyricPageContainer(){
    const {isLoading, isError, data, error} = useQuery(["lyrics"], fetchLyricData)
    
    if (isLoading) {
        return <PageContainer><span>Loading...</span></PageContainer>
      }
    
    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }
    const lyricData = data as ILyricData[]

    return (
        <PageContainer>
            <Outlet context={lyricData}/>
        </PageContainer>
    )
}

async function fetchLyricData(): Promise<ILyricData[]> {
    const res = await fetch("/api/song_lyric")
    if(!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
    }
    else {
        return await res.json() as ILyricData[];
    }
}

export function LyricListPage(){
    const lyricData = useOutletContext<ILyricData[]>()
    return (
        <>
            <h1>Studenttraller</h1>
                <ul>
                    {lyricData.map(lyric => (
                    <li key={lyric.url}>
                        <Link to={`/studenttraller/${lyric.title}`}>{lyric.title}</Link>
                    </li>
                ))}
            </ul>
        </>
    )
}

export function LyricItemPage(){
    let params = useParams();
    const lyricData = useOutletContext<ILyricData[]>()
    const lyricItem = lyricData.find(item => item.title === params.lyricTitle)

    if(!lyricItem){
        return <Navigate to="/studenttraller" replace={true} />
    }

	return (
        <>
            <h2>{lyricItem.title}</h2>
            {lyricItem.url}
        </>
	)   
}

interface ILyricData {
    title: string,
    url: string,
    melody?: string,
    textOrigin?: string,
    description?: string
}