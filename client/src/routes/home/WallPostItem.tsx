import { Breadcrumbs, Link } from "@mui/material";
import { strToNumber } from "common/utils";
import { Navigate, useParams, Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useQuery } from "@tanstack/react-query";
import { WallPost } from "common/interfaces";
import { fetchAsync } from "src/utils/fetchAsync";
import { PostSectionItem, PostSectionSkeleton } from "src/components/PostingWall";
import { LikesContextProvider, useLikes } from 'src/components/likes/LikesContext'

export {
    ParamValidator as WallPostItemPage
}

function ParamValidator() {

    const params = useParams();
    const postId = strToNumber(params.postId)    
    
    if(!postId)
        return <Navigate to="/vegg" />


    return (
        <div
            style={{
                marginTop: "22px",
                maxWidth: "650px",
                marginBottom: "300px"
            }}
        >
            <NavBreadCrumbs/>  
            <div 
                style={{
                    marginTop: "35px"
                }}
            >
                <PostFetcher postId={postId}/>
            </div>
        </div>
    )
}

function NavBreadCrumbs() {
    return (
            <Breadcrumbs
                separator={<NavigateNextIcon  />}
                style={{
                    fontSize: "30px"
                }}
            >
            <Link
                component={RouterLink}
                to="/vegg"
                color="secondary"
                underline="hover"
            >
                Vegg
            </Link>
            <Link
                component={RouterLink}
                to="#"
                color="inherit"
                underline="hover"
            >
                Innlegg
            </Link>
        </Breadcrumbs>
    )
}

function PostFetcher({
    postId
}: {
    postId: number
}) {
    const queryKey = ["wall-post", postId, "item" ]
    const url = `/api/wall-posts/${postId}`
    const { isLoading, isError, data, error } = useQuery<WallPost>(queryKey, () => fetchAsync<WallPost>(url))

    if(isLoading) {
        return <PostSectionSkeleton length={1} />
    }

    if(isError) {
        return <div>{`${error}`}</div>
    }

    return (
                <LikesContextProvider
                    key={post.id}
                    entityType={LikeEntityType.WallPost}
                    entityId={post.id}
                >
        <PostSectionItem post={data} />
                </LikesContextProvider>
    )
}