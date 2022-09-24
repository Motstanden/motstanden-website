import React from "react"
import { useQuery } from '@tanstack/react-query'
import { UrlList, UrlListItem } from "../../components/UrlList"
import { fetchAsync } from "../../utils/fetchAsync"
import { Navigate, useOutletContext, useParams } from "react-router-dom"
import { FileTable } from "./FileTable"
import { useTitle } from "../../hooks/useTitle"

export function SongListPage( {mode}: {mode?: "repertoire"}){

    const isRepertoire: boolean = mode === "repertoire" 

    useTitle(isRepertoire ? "Repertoar" : "Alle noter");

    let data = useOutletContext<ISongInfo[]>()
    if(isRepertoire)
        data = data.filter(item => !!item.isRepertoire)

    return (
        <>
            <h1>Notearkiv</h1>
            <UrlList>
                { data.map( song => (
                        <UrlListItem 
                            key={song.url} 
                            to={`/notearkiv/${isRepertoire ? "repertoar" : "alle"}/${song.url}`} 
                            text={song.title}
                            /> 
                    ))
                }
            </UrlList>
        </>
    )
}

export function InstrumentListPage(){
    const params = useParams();
    const songData = useOutletContext<ISongInfo[]>()
    const song = songData.find(item => item.url === params.title)

    useTitle(song?.title)

    const {isLoading, isError, data, error} = useQuery<ISongFile[]>(["FetchSheetArchiveFile", song!.url], () => {
        if(song) {
            return fetchAsync<ISongFile[]>(`/api/sheet_archive/song_files?titleId=${song.titleId}`)
        }
        else{
            throw new Error("Title is null")
        }}, {
            retry: false
    })
    
    if (isLoading) {
        return <>Loading...</>
    }

    if(isError){
        return <Navigate to="/notearkiv" replace={true} />
    }

    return (
        <>
            <h3>{song!.title}</h3>
            <div style={{marginBottom: "150px", marginTop: "30px"}}>
                <FileTable files={data} />
            </div>

        </>
    )
}

export interface ISongInfo {
    url: string,
    title: string,
    extraInfo: string,
    titleId: number
    isRepertoire: number    // 1 = true, 0 = false
}

export interface ISongFile {
    url: string,
    clef: string,
    instrument: string,
    instrumentVoice: number,
    transposition: string
}