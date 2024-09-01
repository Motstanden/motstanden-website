import { Link, Skeleton } from "@mui/material"
import dayjs from "dayjs"
import { Link as RouterLink } from "react-router-dom"
import { useTimeZone } from "src/context/TimeZone"
import { useUserReference } from "src/context/UserReference"

export const authorInfoTextStyle: React.CSSProperties = { 
    fontSize: "xx-small",
    opacity: 0.75,
}

export function AuthorInfo({ 
    createdAt,
    createdByUserId,
    updatedAt,
    updatedByUserId,
    style
} : {
    createdAt?: string,
    createdByUserId?: number,
    updatedAt?: string,
    updatedByUserId?: number,
    style?: React.CSSProperties
}){

    if(!createdAt || !createdByUserId || !createdByUserId)
        return <></>

    const showUpdated = updatedByUserId !== undefined &&
        createdByUserId !== undefined &&
        updatedAt !== undefined &&
        updatedAt !== createdAt

    return (
        <div style={{
            ...authorInfoTextStyle,
            paddingBlock: "10px",
            display: "grid",
            gridTemplateColumns: "min-content auto",
            columnGap: "5px",
            rowGap: "4px",
            ...style
        }}>
            <div>
                Opprettet:
            </div>
            <div>
                <AuthorItem 
                    userId={createdByUserId} 
                    dateTime={createdAt} />
            </div>
            {showUpdated && (
                <>
                    <div>
                        Redigert:
                    </div>
                    <div>
                        <AuthorItem 
                            userId={updatedByUserId} 
                            dateTime={updatedAt} />
                    </div>
                </>
            )}
        </div>
    )
}

export function AuthorItem({ userId, dateTime }: { userId: number, dateTime: string }) {
    const { getUser, isPending, isError } = useUserReference()
    useTimeZone()

    if(isPending)
        return <Skeleton variant="text" style={{display: "inline-block", width: "190px"}} />
    
    if(isError)
        return <span style={{color: "red"}}>Oops, noe gikk galt...🤔</span>

    const user = getUser(userId)
    return (
        <span>
            {`${dayjs.utc(dateTime).tz().format("DD. MMM YYYY HH:mm")}, av `}


            {user.isDeleted && (
                <span>
                    {user.fullName}
                </span>
            )}
            
            {!user.isDeleted && (
                <Link
                    color="secondary"
                    component={RouterLink}
                    to={`/medlem/${userId}`}
                    underline="hover"
                >
                    {user.fullName}
                </Link> 

            )}

        </span>
    )
}