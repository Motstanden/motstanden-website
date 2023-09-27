import { BoardWebsite } from "common/interfaces"
import { UrlList, UrlListItem } from "src/components/UrlList"
import { useTitle } from "src/hooks/useTitle"
import { PageContainer } from "src/layout/PageContainer"

// Temporary
// This should be in the database
const boardPages: BoardWebsite[] = [
    {
        year: 2022,
        url: "https://styret.motstanden.no/2022"
    },
    {
        year: 2021,
        url: "https://styret.motstanden.no/2021"
    },
    {
        year: 2020,
        url: "https://styret.motstanden.no/2020"  
    },
    {
        year: 2019,
        url: "https://styret.motstanden.no/2019"
    },
    {
        year: 2018,
        url: "https://styret.motstanden.no/2018"
    }
]

export default function BoardWebsiteListPage() {
    useTitle("Styrets nettsider")
    return (
        <PageContainer>
            <h1>Styrets nettsider</h1>
            <UrlList>
                {boardPages.map( boardPage => (
                    <UrlListItem 
                        key={boardPage.year} 
                        to={boardPage.url}
                        externalRoute
                        text={`Styret ${boardPage.year}`}
                    />
                ))}
            </UrlList>
        </PageContainer>
    )
}