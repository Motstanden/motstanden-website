import { useQuery } from '@tanstack/react-query';
import { SheetArchiveFile, SheetArchiveTitle } from 'common/interfaces';
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom";
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer";
import { fetchFn } from "../../utils/fetchAsync";
import { InstrumentPageSkeleton } from './skeleton/InstrumentPage';

export const sheetArchiveContextQueryKey = ["FetchSheetArchiveTitles"]

export {
    InstrumentContainer as InstrumentContext, SheetArchiveContainer as SheetArchiveContext
};

export function SheetArchiveContainer() {

    return (
        <TabbedPageContainer
            tabItems={[
                { to: "/notearkiv/repertoar", label: "Repertoar" },
                { to: "/notearkiv/alle", label: "Alle" },
            ]}
            matchChildPath={true}
        >
            <SheetArchiveLoader/>
        </TabbedPageContainer>
    )
}

function SheetArchiveLoader() {
    const { isPending, isError, data, error } = useQuery<SheetArchiveTitle[]>({
        queryKey: sheetArchiveContextQueryKey,
        queryFn: fetchFn<SheetArchiveTitle[]>("/api/sheet_archive/song_title"),
    });


    if (isError) {
        return `${error}`
    }

    const context = isPending 
        ? { 
            isPending: true, 
            sheetArchive: [] 
        } : { 
            isPending: false, 
            sheetArchive: data.map( item => ({ ...item, url: buildSongUrl(item) })) 
        } 

    return (
        <Outlet context={context} />
    );
}

function InstrumentContainer() {
    const { sheetArchive, isPending } = useSheetArchiveContext()

    const { title } = useParams();

    if(!title)
        return <Navigate to="./.." replace={true}  />

    if(isPending)
        return <InstrumentPageSkeleton/>

    const song = sheetArchive.find(item => item.url.endsWith(title))

    if(!song)
        return <Navigate to="./.." replace={true}  />

    return (
        <InstrumentLoader song={song}/>
    )
}


export function InstrumentLoader( {song}: {song: SheetArchiveTitle} ) {

    const { isPending, isError, error, data } = useQuery<SheetArchiveFile[]>({
        queryKey: ["FetchSheetArchiveFile", song.url],
        queryFn: fetchFn<SheetArchiveFile[]>(`/api/sheet_archive/song_files?id=${song.id}`),
    })

    if (isPending) {
        return <InstrumentPageSkeleton title={song.title}/>
    }

    if (isError) {
        return `${error}`;
    }

    const context: InstrumentContextProps = {
        song: song,
        files: data
    }

    return (
        <Outlet context={context}/>
    )
}


type SheetArchiveContextProps = 
    { isPending: true, sheetArchive: never[] } |
    { isPending: false, sheetArchive: SheetArchiveTitle[] }

export function useSheetArchiveContext() { 
    return useOutletContext<SheetArchiveContextProps>()
}

type InstrumentContextProps = { song: SheetArchiveTitle, files: SheetArchiveFile[] } 

export function useInstrumentContext(): InstrumentContextProps {
    return useOutletContext<InstrumentContextProps>()
}

function buildSongUrl(song: SheetArchiveTitle){
    return `/notearkiv/${song.isRepertoire ? "repertoar" : "alle"}/${song.url}`
}