import {
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { isNullOrWhitespace } from "common/utils"
import dayjs from "dayjs"
import { headerStyle, rowStyle } from "src/assets/style/tableStyle"
import { useTitle } from "src/hooks/useTitle"
import { PageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"


export default function BoardWebsiteListPage() {
    useTitle("Styrets nettsider")
    return (
        <PageContainer>
            <h1>Styrets nettsider</h1>
            <Description />
            <BoardPages />
            <AboutSourceCode />
        </PageContainer>
    )
}

function Description() {
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

function BoardPages() {
    return (
        <section style={{ marginTop: "40px" }}>
            <h2>Alle Styrenettsider</h2>
            <BoardPagesList />
        </section>
    )
}

interface RawProjectData {
    pages?: RawPageData[]
}

interface RawPageData {
    year?: string,
    relativeUrl?: string,
    created?: string,
    updated?: string,
    isUpdated?: string | boolean,
}

function BoardPagesList() {

    const { isLoading, isError, data, error } = useQuery<RawProjectData>(["styret.motstanden.no/projectData.json"], () => fetchAsync<RawProjectData>("https://styret.motstanden.no/projectData.json"))

    if (isLoading || !data?.pages)
        return <></>

    if (isError)
        return <>{error}</>

    const pages = data.pages
        .filter(page => page.year && page.relativeUrl)
        .map(page => {
            return {
                ...page,
                year: page.year!,
                relativeUrl: removeIndexFromUrl(page.relativeUrl!),
                isUpdated: page.isUpdated?.toString().toLowerCase() === "true",
                created: formatDirtyDate(page.created),
                updated: formatDirtyDate(page.updated),
            }
        })
        .reverse()

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={headerStyle}>
                    <TableRow>
                        <TableCell>År</TableCell>
                        <TableCell>Redigert</TableCell>
                        <TableCell>Opprettet</TableCell>
                        <TableCell>Oppdatert</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pages.map((page, index) => (
                        <TableRow key={index} sx={rowStyle}>
                            <TableCell>
                                <Link
                                    href={`https://styret.motstanden.no/${page.relativeUrl}`}
                                    color="secondary"
                                    underline="hover">
                                    {page.year}
                                </Link>
                            </TableCell>
                            <TableCell>
                                {page.isUpdated ? "Ja" : "Nei"}
                            </TableCell>
                            <TableCell>
                                {page.created}
                            </TableCell>
                            <TableCell>
                                {page.updated}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function removeIndexFromUrl(url: string) {
    const indexPattern = /\/(index\.html|index\.htm|index)$/
    if (url.match(indexPattern)) {
        url = url.replace(indexPattern, '');
    }
    return url;
}

function formatDirtyDate(date: string | undefined): string {
    if(isNullOrWhitespace(date))
        return "–"

    return dayjs(date).format("D. MMM YYYY")
}

function AboutSourceCode() {
    return (
        <section style={{
            marginTop: "40px",
            maxWidth: "650px",
            lineHeight: "1.6",
        }}>
            <h2 style={{ marginBottom: "0px" }}>Kildekode</h2>
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