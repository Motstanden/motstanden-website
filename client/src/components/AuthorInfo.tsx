import { Link } from "@mui/material"
import dayjs from "dayjs"
import { Link as RouterLink } from "react-router-dom"
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
    const { userReference } = useUserReference()
    const user = userReference[userId]
    return (
        <span>
            {`${dayjs(dateTime).utc(true).local().format("DD. MMM YYYY HH:mm")}, av `}
            <Link
                color="secondary"
                component={RouterLink}
                to={`/medlem/${userId}`}
                underline="hover"
            >
                {user.fullName}
            </Link>
        </span>
    )
}