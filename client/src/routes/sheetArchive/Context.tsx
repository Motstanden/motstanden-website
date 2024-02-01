import { useQuery } from '@tanstack/react-query';
import { SheetArchiveTitle } from 'common/interfaces';
import React from "react";
import { Outlet } from "react-router-dom";
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer";
import { fetchFn } from "../../utils/fetchAsync";

export const sheetArchiveContextQueryKey = ["FetchSheetArchiveTitles"]

export function SheetArchiveContext() {

    const { isPending, isError, data, error } = useQuery<SheetArchiveTitle[]>({
        queryKey: sheetArchiveContextQueryKey,
        queryFn: fetchFn<SheetArchiveTitle[]>("/api/sheet_archive/song_title"),
    });

    if (isPending) {
        return <PageContainer><div /></PageContainer>;
    }

    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>;
    }

    const newData = data.map( item => { return { ...item, url: buildSongUrl(item) } })

    return (
        <PageContainer>
            <Outlet context={newData} />
        </PageContainer>
    );
}


function PageContainer({ children }: { children?: React.ReactNode }) {
    return (
        <TabbedPageContainer
            tabItems={[
                { to: "/notearkiv/repertoar", label: "Repertoar" },
                { to: "/notearkiv/alle", label: "Alle" },
            ]}
            matchChildPath={true}
        >
            {children}
        </TabbedPageContainer>
    )
}

function buildSongUrl(song: SheetArchiveTitle){
    return `/notearkiv/${song.isRepertoire ? "repertoar" : "alle"}/${song.url}`
}