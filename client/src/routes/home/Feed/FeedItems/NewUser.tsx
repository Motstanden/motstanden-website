import { Link } from "@mui/material"
import { NewUserFeedItem } from "common/types"
import { Link as RouterLink } from "react-router-dom"

export {
    NewUser as NewUserFeedItem
}

function NewUser({ data }: {data: NewUserFeedItem }) {
    return (
        <>
            <Link
                color="secondary"
                component={RouterLink}
                to={`/brukere/${data.id}`}
                underline="hover"
            >
                {data.fullName}
            </Link>   
            {` har blitt med på siden! 🎉`}     
        </>
    )
}