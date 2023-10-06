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
import { isNullOrWhitespace, strToNumber } from "common/utils"
import dayjs, { Dayjs } from "dayjs"
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
            <BoardPageSection />
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

function BoardPageSection() {
    return (
        <section style={{ marginTop: "40px" }}>
            <h2>Alle Styrenettsider</h2>
            <BoardPageTableLoader />
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

interface PageData {
    year: number,
    relativeUrl: string,
    created?: Dayjs,
    updated?: Dayjs,
    isUpdated: boolean,
}

function removeIndexFromUrl(url: string) {
    const indexPattern = /\/(index\.html|index\.htm|index)$/
    if (url.match(indexPattern)) {
        url = url.replace(indexPattern, '');
    }
    return url;
}

function BoardPageTableLoader() {

    const { isLoading, isError, data, error } = useQuery<RawProjectData>(["styret.motstanden.no/projectData.json"], () => fetchAsync<RawProjectData>("https://styret.motstanden.no/projectData.json"))

    if (isLoading || !data?.pages)
        return <></>

    if (isError)
        return <>{error}</>

    const pages: PageData[] = data.pages
        .filter(page => page.year && page.relativeUrl && strToNumber(page.year))
        .map(page => {
            return {
                year: strToNumber(page.year)!,
                relativeUrl: removeIndexFromUrl(page.relativeUrl!),
                isUpdated: page.isUpdated?.toString().toLowerCase() === "true",
                created: isNullOrWhitespace(page.created) ? undefined : dayjs(page.created),
                updated: isNullOrWhitespace(page.updated) ? undefined : dayjs(page.updated),
            }
        })
        .reverse()

    return (
        <BoardPageTable data={pages} />
    )
}

function BoardPageTable( {data} : {data: PageData[]}) {
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
                    {data.map((page, index) => (
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
                                {page.created?.format("D. MMM YYYY") ?? "–"}
                            </TableCell>
                            <TableCell>
                                {page.updated?.format("D. MMM YYYY") ?? "–"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
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