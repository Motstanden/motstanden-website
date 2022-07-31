import React from "react"
import { useQuery } from '@tanstack/react-query'
import { UrlList, UrlListItem } from "../../components/UrlList"
import { PageContainer } from "../../layout/PageContainer"
import { fetchAsync } from "../../utils/fetchAsync"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { strToPrettyUrl } from "../../utils/strToPrettyUrl"
import { FileTable } from "./FileTable"
import { useTitle } from "../../hooks/useTitle"

export function SheetArchivePageContainer() {
    useTitle("Notearkiv")

    const {isLoading, isError, data, error} = useQuery<ISongInfo[]>(["FetchSheetArchiveTitles"], () => fetchAsync<ISongInfo[]>("/api/sheet_archive/song_title") )
    
    if (isLoading) {
        return <PageContainer><div/></PageContainer>
      }
    
    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }

    const newData = data.map( item => {
        let url = item.url
        let title = item.title
        if(item.extraInfo){
            url = strToPrettyUrl(`${url} (${item.extraInfo})`)
            title = `${title} (${item.extraInfo})`
        }
        return {
            url: url,
            title: title,
            extraInfo: item.extraInfo,
            titleId: item.titleId
        }
    })

    return (
        <PageContainer>
            <Outlet context={newData}/>
        </PageContainer>
    )
}

export function SongListPage(){
    const data = useOutletContext<ISongInfo[]>()
    return (
        <>
            <h1>Notearkiv</h1>
            <UrlList>
                { data.map( song => (
                        <UrlListItem 
                            key={song.url} 
                            to={`/notearkiv/${song.url}`} 
                            text={song.title}
                            reloadDocument/> 
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

interface ISongInfo {
    url: string,
    title: string,
    extraInfo: string,
    titleId: number
}

export interface ISongFile {
    url: string,
    clef: string,
    instrument: string,
    instrumentVoice: number,
    transposition: string
}