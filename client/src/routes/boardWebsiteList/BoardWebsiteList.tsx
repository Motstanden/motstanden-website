import { Link } from "@mui/material"
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
            <AboutSourceCode/>
        </PageContainer>
    )
}

function Description(){
    return (
        <section style={{
            maxWidth: "650px",
            lineHeight: "1.6",
        }}>
            <h2>Om Styrenettsidene</h2>
            <p>
                Hvert styre i Motstanden har sin egen nettside.
                Til å begynne med inneholder nettsiden kun navnene til de i styret.
                Videre er det opp til styret hva de vil gjøre med nettsiden i løpet av det neste året.
            </p>
        </section>
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
        <section style={{marginTop: "40px"}}>
            <h2>Alle Styrenettsider</h2>
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
        </section>
    )
}

function AboutSourceCode() {
    return (
        <section style={{
            marginTop: "40px",
            maxWidth: "650px",
            lineHeight: "1.6",
        }}>
            <h2 style={{marginBottom: "0px"}}>Kildekode</h2>
            <p>
                <span>
                    Kildekoden til nettsidene er åpent tilgjengelig på 
                </span>
                <span> </span>
                <Link 
                    color="secondary" 
                    underline="hover"
                    href="https://github.com/Motstanden/motstanden-styresider"
                    >
                    GitHub
                </Link>
                <span>.</span>
            </p>
        </section>
    )
}