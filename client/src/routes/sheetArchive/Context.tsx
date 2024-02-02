import { useQuery } from '@tanstack/react-query';
import { SheetArchiveTitle } from 'common/interfaces';
import React from "react";
import { Outlet } from "react-router-dom";
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer";
import { fetchFn } from "../../utils/fetchAsync";

export const sheetArchiveContextQueryKey = ["FetchSheetArchiveTitles"]

export {
    SheetArchiveContainer as SheetArchiveContext
}

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

    if (isPending) {
        return <></>
    }

    if (isError) {
        return `${error}`
    }

    const newData = data.map( item => { return { ...item, url: buildSongUrl(item) } })

    return (
        <Outlet context={newData} />
    );
}

function buildSongUrl(song: SheetArchiveTitle){
    return `/notearkiv/${song.isRepertoire ? "repertoar" : "alle"}/${song.url}`
}