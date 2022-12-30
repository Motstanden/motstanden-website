import { useQuery } from '@tanstack/react-query';
import { SheetArchiveTitle } from 'common/interfaces';
import React from "react";
import { Outlet } from "react-router-dom";
import { TabbedPageContainer } from "src/layout/PageContainer";
import { fetchAsync } from "../../utils/fetchAsync";
import { strToPrettyUrl } from "../../utils/strToPrettyUrl";


export function SheetArchiveContext() {

    const { isLoading, isError, data, error } = useQuery<SheetArchiveTitle[]>(["FetchSheetArchiveTitles"], () => fetchAsync<SheetArchiveTitle[]>("/api/sheet_archive/song_title"));

    if (isLoading) {
        return <PageContainer><div /></PageContainer>;
    }

    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>;
    }

    const newData: SheetArchiveTitle[] = data.map(item => {
        let url = item.url;
        let title = item.title;
        if (item.extraInfo) {
            url = strToPrettyUrl(`${url} (${item.extraInfo})`);
            title = `${title} (${item.extraInfo})`;
        }
        return {
            ...item,
            url: url,
            title: title,
        };
    });

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