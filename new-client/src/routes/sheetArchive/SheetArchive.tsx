import React from "react"
import { useQuery } from '@tanstack/react-query'
import { UrlList, UrlListItem } from "../../components/UrlList"
import { PageContainer } from "../../layout/PageContainer"
import { fetchAsync } from "../../utils/fetchAsync"

export default function SheetArchive(){
    return (
        <PageContainer>
            <h1>Notearkiv</h1>
            <SongList/>
        </PageContainer>
    )
}


function SongList(){
    const {isLoading, isError, data, error} = useQuery<SongInfo[]>(["FetchDocuments"], () => fetchAsync<SongInfo[]>("/api/sheet_archive/song_title") )
    
    if (isLoading) {
        return <PageContainer><div/></PageContainer>
    }
    
    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }

    return (
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
    )
}

interface SongInfo{
    url: string,
    title: string,
    extraInfo: string,
    titleId: number
}