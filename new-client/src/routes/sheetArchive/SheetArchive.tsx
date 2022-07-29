import React from "react"
import { useQuery } from '@tanstack/react-query'
import { UrlList, UrlListItem } from "../../components/UrlList"
import { PageContainer } from "../../layout/PageContainer"
import { fetchAsync } from "../../utils/fetchAsync"
import { Outlet, useOutletContext, useParams } from "react-router-dom"

export function SheetArchivePageContainer() {
    const {isLoading, isError, data, error} = useQuery<ISongInfo[]>(["FetchDocuments"], () => fetchAsync<ISongInfo[]>("/api/sheet_archive/song_title") )
    
    if (isLoading) {
        return <PageContainer><div/></PageContainer>
      }
    
    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }
    return (
        <PageContainer>
            <Outlet context={data}/>
        </PageContainer>
    )
}

export function SongListPage(){
    const data = useOutletContext<ISongInfo[]>()
    return (
        <>
            <h3>Notearkiv</h3>
            <UrlList>
                { data.map( song => {
                    const extraInfo = song.extraInfo ? `(${song.extraInfo})` : "" 
                    return (
                        <UrlListItem 
                        key={song.titleId} 
                            to={`/notearkiv/${song.url + "_" + extraInfo}`} 
                            text={song.title + " " + extraInfo}
                            reloadDocument/> 
                    )})
                }
            </UrlList>
        </>
    )
}

export function InstrumentListPage(){
    const params = useParams();
    const data = useOutletContext<ISongInfo[]>()
    return (
        <>
            <h3>{params.title}</h3>
        </>
    )
}

interface ISongInfo{
    url: string,
    title: string,
    extraInfo: string,
    titleId: number
}