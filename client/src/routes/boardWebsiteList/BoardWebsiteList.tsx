import { BoardWebsite } from "common/interfaces"
import { UrlList, UrlListItem } from "src/components/UrlList"
import { useTitle } from "src/hooks/useTitle"
import { PageContainer } from "src/layout/PageContainer"


export default function BoardWebsiteListPage() {
    useTitle("Styrets nettsider")
    return (
        <PageContainer>
            <h1>Styrets nettsider</h1>
            <Description/>
            <BoardPages/>
        </PageContainer>
    )
}

function Description(){
    return (
        
        <div>
            <h2>Om Styrenettsidene</h2>
            <p style={{
                maxWidth: "650px", 
                paddingBottom: "15px",
                fontSize: "14pt",
                lineHeight: "1.6",
                }}>
                Hvert styre i Motstanden har sin egen nettside.
                Til å begynne med inneholder nettsiden kun navnene til de i styret.
                Videre er det opp til styret hva de vil gjøre med nettsiden i løpet av det neste året.
            </p>
            <h2>Alle Styrenettsider</h2>
        </div>
    )
}

// Temporary
// This should be in the database so that we don't need to modify the source code to update the list.
const boardPagesData: BoardWebsite[] = [
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

function BoardPages() {
    return (
        <UrlList>
            {boardPagesData.map( boardPage => (
                <UrlListItem 
                    key={boardPage.year} 
                    to={boardPage.url}
                    externalRoute
                    text={`Styret ${boardPage.year}`}
                />
            ))}
        </UrlList>
    )
}