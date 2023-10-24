import { Breadcrumbs, Link } from "@mui/material";
import { strToNumber } from "common/utils";
import { Navigate, useParams, Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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
                marginTop: "22px"
            }}
        >
            <NavBreadCrumbs/>  
            <PostFetcher postId={postId}/>
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
    // TODO
    return (
        <>
        </>
    )

}