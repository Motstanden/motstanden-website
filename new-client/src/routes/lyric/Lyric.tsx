import React from "react"
import { PageContainer } from "../PageContainer" 
import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom"


export function LyricPageContainer(){
    const {isLoading, isError, data, error} = useQuery(["AllLyricData"], fetchLyricTitles)
    
    if (isLoading) {
        return <PageContainer><></></PageContainer>
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

async function fetchLyricTitles(): Promise<ILyricData[]> {
    const res = await fetch("/api/song_lyric")
    if(!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
    }
    else {
        return await res.json() as ILyricData[];
    }
}

async function fetchLyricHtml(title: string): Promise<ILyricHtml> {
    const res = await fetch(`/api/song_lyric_data?title=${title}`)
    if(!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
    }
    else {
        return await res.json();
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
    const params = useParams();
    const title = params.lyricTitle;

    const {isLoading, isError, data, error} = useQuery(["LyricItem", title], () => {
        if(title) {
            return fetchLyricHtml(title)
        }
        else{
            throw new Error("Title is null")
        }}, {
            retry: false
        })
    
    if (isLoading) {
        return <></>
    }

    if(isError){
        return <Navigate to="/studenttraller" replace={true} />
    }

    const html = data as ILyricHtml
	return (
        <>
            <h2>{title}</h2>
            <div dangerouslySetInnerHTML={{__html: html.lyricHtml}}/>
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

interface ILyricHtml {
    lyricHtml: string
}