import React from "react";
import { useQuery } from '@tanstack/react-query';
import { fetchAsync } from "../../utils/fetchAsync";
import { Outlet } from "react-router-dom";
import { strToPrettyUrl } from "../../utils/strToPrettyUrl";
import { useTitle } from "../../hooks/useTitle";
import { ISongInfo } from "./SheetArchive";
import { TabbedPageContainer } from "src/layout/PageContainer";


export function SheetArchiveContext() {
    useTitle("Notearkiv");

    const { isLoading, isError, data, error } = useQuery<ISongInfo[]>(["FetchSheetArchiveTitles"], () => fetchAsync<ISongInfo[]>("/api/sheet_archive/song_title"));

    if (isLoading) {
        return <PageContainer><div /></PageContainer>;
    }

    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>;
    }

    const newData = data.map(item => {
        let url = item.url;
        let title = item.title;
        if (item.extraInfo) {
            url = strToPrettyUrl(`${url} (${item.extraInfo})`);
            title = `${title} (${item.extraInfo})`;
        }
        return {
            url: url,
            title: title,
            extraInfo: item.extraInfo,
            titleId: item.titleId,
            isRepertoire: item.isRepertoire
        };
    });

    return (
        <PageContainer>
            <Outlet context={newData} />
        </PageContainer>
    );
}


function PageContainer({ children }: {children?: React.ReactNode}) {
    return (
        <TabbedPageContainer 
            tabItems={[
                {to: "/notearkiv/repertoar",    label: "Repertoar"},
                {to: "/notearkiv/alle",        label: "Alle"},
            ]}
        >
            {children}
        </TabbedPageContainer>
    )
}