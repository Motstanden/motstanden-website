import { Divider, Grid, Skeleton } from "@mui/material"
import { PostListSkeleton } from "src/components/PostingWall"
import { PageContainer } from "src/layout/PageContainer/PageContainer"

export {
    PageSkeleton as UserPageSkeleton
}

function PageSkeleton() {
    return (
        <PageContainer>
            <div style={{maxWidth: "1300px"}}>
                <Skeleton 
                    variant="rounded" 
                    height="390px" 
                    sx={{
                        mt: 3,
                    }}/>   
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Grid 
                    container 
                    alignItems="top" 
                    spacing={4}>
                    <CardSkeleton height="235px"/>
                    <CardSkeleton height="230px"/>
                    <CardSkeleton height="190px"/>
                </Grid>
                <Divider sx={{my: 4}} />
                <h1>Tidslinje</h1>
                <Skeleton 
                    variant="rounded"
                    height="158px"
                    sx={{
                        mb: "20px"
                    }}
                />
                <PostListSkeleton length={3}/>
            </div>
        </PageContainer>

    )
}

function CardSkeleton( {height}: {height: string} ) {
    return (
        <Grid item xs={12} sm={6} sx={{height: "100%"}}>
            <Skeleton 
                variant="rounded"
                height={height}
            />
        </Grid>
    )
}