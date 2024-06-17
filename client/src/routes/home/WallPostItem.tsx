import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, Link } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { LikeEntityType } from "common/enums";
import { WallPost } from "common/interfaces";
import { strToNumber } from "common/utils";
import { Navigate, Link as RouterLink, useParams } from "react-router-dom";
import { LikesContextProvider } from 'src/components/likes/LikesContext';
import { PostListSkeleton, PostSectionItem } from "src/components/PostingWall";
import { fetchFn } from "src/utils/fetchAsync";

export {
    ParamValidator as WallPostItemPage
};

function ParamValidator() {

    const params = useParams();
    const postId = strToNumber(params.postId)    
    
    if(!postId)
        return <Navigate to="/vegg" replace />


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
    const { isPending, isError, data, error } = useQuery<WallPost>({
        queryKey: queryKey,
        queryFn: fetchFn<WallPost>(url),
    })

    if(isPending) {
        return <PostListSkeleton length={1} />
    }

    if(isError) {
        return <div>{`${error}`}</div>
    }

    return (
        <LikesContextProvider
            entityType={LikeEntityType.WallPost}
            entityId={data.id}
        >
            <PostSectionItem post={data} queryKey={queryKey}/>
        </LikesContextProvider>
    )
}