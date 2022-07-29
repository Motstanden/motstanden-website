import React from "react"
import { useQuery } from '@tanstack/react-query'
import { UrlList, UrlListItem } from "../../components/UrlList"
import { PageContainer } from "../../layout/PageContainer"
import { fetchAsync } from "../../utils/fetchAsync"
import { Outlet, useOutletContext, useParams } from "react-router-dom"
import { strToPrettyUrl } from "../../utils/strToPrettyUrl"

export function SheetArchivePageContainer() {
    const {isLoading, isError, data, error} = useQuery<ISongInfo[]>(["FetchDocuments"], () => fetchAsync<ISongInfo[]>("/api/sheet_archive/song_title") )
    
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
            <h3>Notearkiv</h3>
            <UrlList>
                { data.map( song => {
                    const extraInfo = song.extraInfo ? `(${song.extraInfo})` : "" 
                    return (
                        <UrlListItem 
                        key={song.titleId} 
                            to={`/notearkiv/${song.url}`} 
                            text={song.title}
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
    const song = data.find(item => item.url === params.title)
    return (
        <>
            <h3>{song?.title}</h3>
            test
        </>
    )
}

interface ISongInfo{
    url: string,
    title: string,
    extraInfo: string,
    titleId: number
}