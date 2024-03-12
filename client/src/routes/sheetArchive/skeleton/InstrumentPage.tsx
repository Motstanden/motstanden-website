import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { headerStyle } from "src/assets/style/tableStyle"
import { useTitle } from "src/hooks/useTitle"

export {
    PageSkeleton as InstrumentPageSkeleton
}

function PageSkeleton( {title}: {title?: string}) {
    useTitle(title)
    return (
        <>
            <h1>
                {title ? title : (
                    <Skeleton variant="text" width="300px" />
                )}
            </h1>
            <div style={{ 
                maxWidth: "1300px",
                marginBottom: "150px", 
                marginTop: "30px" 
            }}>
                <TableSkeleton />
            </div>
        </>
    )
}

function TableSkeleton() {
    return (
        <TableContainer component={Paper}>
            <Table>
            <TableHead sx={headerStyle}>
                <TableRow>
                    <TableCell>Instrument</TableCell>
                    <TableCell>Natura</TableCell>
                    <TableCell>Nøkkel</TableCell>
                </TableRow>
            </TableHead>
                <TableBody>
                    <TableRowsSkeleton length={15} />
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function TableRowsSkeleton({ length }: { length: number }) {
    return Array(length).fill(0).map((_, index) => (
        <TableRowSkeleton key={index} />
    ))
}

function TableRowSkeleton() {
    return (
        <TableRow>
            <TableCell>
                <Skeleton variant="text" width="110px" />
            </TableCell>
            <TableCell>
                <Skeleton variant="text" width="18px" />
            </TableCell>
            <TableCell>
                <Skeleton variant="text" width="60px" />
            </TableCell>
        </TableRow>
    )
}