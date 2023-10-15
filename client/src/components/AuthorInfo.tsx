import { Link } from "@mui/material"
import dayjs from "dayjs"
import { Link as RouterLink } from "react-router-dom"

export function AuthorInfo({ 
    createdAt,
    createdByUserId,
    createdByUserName,
    updatedAt,
    updatedByUserId,
    updatedByUserName,
    style
} : {
    createdAt?: string,
    createdByUserId?: number,
    createdByUserName?: string,
    updatedAt?: string,
    updatedByUserId?: number,
    updatedByUserName?: string,
    style?: React.CSSProperties
}){

    if(!createdAt || !createdByUserId || !createdByUserName)
        return <></>

    const showUpdated = updatedByUserId !== undefined &&
        updatedByUserName !== undefined &&
        updatedAt !== undefined &&
        updatedAt !== createdAt

    return (
        <div style={{
            fontSize: "xx-small",
            opacity: 0.75,
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
                    userName={createdByUserName} 
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
                            userName={updatedByUserName} 
                            userId={updatedByUserId} 
                            dateTime={updatedAt} />
                    </div>
                </>
            )}
        </div>
    )
}

function AuthorItem({ userName, userId, dateTime }: { userName: string, userId: number, dateTime: string }) {
    return (
        <span>
            {`${dayjs(dateTime).utc(true).local().format("DD. MMM YYYY HH:mm")}, av `}
            <Link
                color="secondary"
                component={RouterLink}
                to={`/medlem/${userId}`}
                underline="hover"
            >
                {`${userName}`}
            </Link>
        </span>
    )
}