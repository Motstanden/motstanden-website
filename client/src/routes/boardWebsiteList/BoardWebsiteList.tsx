import {
    Link,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel
} from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { UserGroup } from "common/enums"
import { hasGroupAccess, isNullOrWhitespace, strToNumber } from "common/utils"
import dayjs, { Dayjs } from "dayjs"
import { useState } from "react"
import { headerStyle, rowStyle } from "src/assets/style/tableStyle"
import { SimpleTextFetcher } from "src/components/SimpleTextFetcher"
import { useAuth } from "src/context/Authentication"
import { useTitle } from "src/hooks/useTitle"
import { PageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"

const topSimpleTextKey = "board-website-list-top"

const bottomSimpleTextKey = "board-website-list-bottom"

export default function BoardWebsiteListPage() {
    useTitle("Styrets nettsider")

    const user = useAuth().user
    const isAdmin = !!user && hasGroupAccess(user, UserGroup.Administrator)

    return (
        <PageContainer>
            <section
                style={{
                    maxWidth: "700px",
                    lineHeight: "1.6",
                    fontSize: "14pt",
                    marginTop: "25px",
                    marginBottom: "40px"
                }}
            >
                <SimpleTextFetcher
                    textKey={topSimpleTextKey}
                    canEdit={isAdmin}
                    skeleton={<TextSkeleton />}
                />

            </section>
            <section
                style={{
                    maxWidth: "1100px"
                }}
            >
                <BoardPageTableLoader />
            </section>
            <section
                style={{
                    maxWidth: "700px",
                    lineHeight: "1.6",
                    fontSize: "14pt",
                    marginTop: "40px"
                }}
            >
                <SimpleTextFetcher
                    textKey={bottomSimpleTextKey}
                    canEdit={isAdmin}
                />
            </section>
        </PageContainer>
    )
}

function TextSkeleton() {
    return (
        <>
            <div style={{
                marginBlock: "30px"
            }}>
            <Skeleton 
                variant="text" 
                width="280px" 
                height="3em"
                />
            </div>
            <div>
            <Skeleton
                    variant="rounded"
                    width="100%"
                    height="180px"
                />
            </div>
        </>   
    )
}

export interface RawProjectData {
    pages?: RawPageData[]
}

export interface RawPageData {
    year?: string,
    relativeUrl?: string,
    created?: string,
    updated?: string,
    isUpdated?: string | boolean,
}

export interface PageData {
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

function cleanPageData( rawPage: RawPageData[] | undefined): PageData[] {
    if(!rawPage)
        return []

    return rawPage
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
}

export const BoardPageUtils = {
    cleanPageData: cleanPageData,
    compareByTimestamp: compareByTimestamp,
}

function BoardPageTableLoader() {

    const { isLoading, isError, data, error } = useQuery<RawProjectData>(["styret.motstanden.no/projectData.json"], () => fetchAsync<RawProjectData>("https://styret.motstanden.no/projectData.json"))

    if (isLoading || !data?.pages)
        return <Skeleton variant="rounded" height={320} />

    if (isError)
        return <>{error}</>

    const pages: PageData[] = cleanPageData(data.pages)

    return (
        <BoardPageTable data={pages} />
    )
}

type SortDirection = "asc" | "desc"

type SortableColumn = "year" | "isUpdated" | "created" | "updated"

function BoardPageTable( {data} : {data: PageData[]}) {

    const [pages, setPages] = useState<PageData[]>(data)
    const [sortedColumn, setSortedColumn] = useState<SortableColumn>("year")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

    const onColumnClick = (column: SortableColumn) => {
        if(column === sortedColumn){
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortedColumn(column)
            if(column === "isUpdated"){
                setSortDirection("asc")
            } else {
                setSortDirection("desc")
            }        
        }
    }

    let sortedPages: PageData[] = [...pages]
    if (sortedColumn === "year") {
        sortedPages.sort((a, b) => compareByNumber(a.year, b.year, sortDirection));
    } 
    else if (sortedColumn === "isUpdated") {
        sortedPages.sort((a, b) => compareByBoolean(a.isUpdated, b.isUpdated, sortDirection));
    } 
    else if (sortedColumn === "created") {
        sortedPages.sort((a, b) => compareByTimestamp(a.created, b.created, sortDirection));
    } 
    else if (sortedColumn === "updated") {
        sortedPages.sort((a, b) => compareByTimestamp(a.updated, b.updated, sortDirection));
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={headerStyle}>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={sortedColumn === "year"}
                                direction={sortedColumn === "year" ? sortDirection : "desc"}
                                onClick={(e) => onColumnClick("year")}
                            >
                                År
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={sortedColumn === "isUpdated"}
                                direction={sortedColumn === "isUpdated" ? sortDirection : "asc"}
                                onClick={(e) => onColumnClick("isUpdated")}
                            >
                                Redigert
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={sortedColumn === "created"}
                                direction={sortedColumn === "created" ? sortDirection : "desc"}
                                onClick={(e) => onColumnClick("created")}
                            >
                                Opprettet
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={sortedColumn === "updated"}
                                direction={sortedColumn === "updated" ? sortDirection : "desc"}
                                onClick={(e) => onColumnClick("updated")}
                            >
                                Oppdatert
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedPages.map((page, index) => (
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

function compareByNumber(a: number, b: number, sortDirection: "asc" | "desc"): number {
    return sortDirection === "asc" ? a - b : b - a;
}

function compareByBoolean(a: boolean, b: boolean, sortDirection: "asc" | "desc"): number {
    return sortDirection === "asc" ? (a ? -1 : 1) : (a ? 1 : -1);
}

function compareByTimestamp(a: Dayjs | undefined, b: Dayjs | undefined, sortDirection: "asc" | "desc"): number {
    const aValue = a?.unix() ?? 0;
    const bValue = b?.unix() ?? 0;
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
}