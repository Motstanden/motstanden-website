import { Grid, Stack } from "@mui/material"
import { UserGroup, UserRank, UserStatus } from "common/enums"
import { userGroupToPrettyStr, userRankToPrettyStr, userStatusToPrettyStr } from "common/utils"
import { ResponsiveTitleCard, TitleCardProps } from "src/components/TitleCard"

export function Card({
    title,
    children,
    spacing
}:
    TitleCardProps & {
        spacing?: number
    }) {
    return (
        <ResponsiveTitleCard title={title} sx={{ height: "100%" }}>
            <Stack spacing={spacing ?? 2}>
                {children}
            </Stack>
        </ResponsiveTitleCard>
    )
}

export function CardTextItem({ label, text }: { label: string, text: string }) {
    return (
        <Grid container>
            <Grid item xs={3} sm={12} md={3} >
                <b>{label}</b>
            </Grid>
            <Grid item xs={9} sm={12} md={9}>
                {text}
            </Grid>
        </Grid>
    )
}

type TextValuePair<T> = {
    text: string,
    value: T
}

function enumToTextValuePair<T>(
    enumObj: {},
    toStrCallback: (enumItem: T) => string): TextValuePair<T>[] {
    return Object.keys(enumObj).map((itemStr) => {
        const item = enumObj[itemStr as keyof typeof enumObj] as T
        return {
            value: item,
            text: toStrCallback(item)
        } as TextValuePair<T>
    }
    )
}

export const rankTVPair = enumToTextValuePair<UserRank>(UserRank, rank => userRankToPrettyStr(rank))
export const groupTVPair = enumToTextValuePair<UserGroup>(UserGroup, group => userGroupToPrettyStr(group))
export const statusTVPair = enumToTextValuePair<UserStatus>(UserStatus, status => userStatusToPrettyStr(status))
export const profilePictureTVPair: TextValuePair<string>[] = [
    {
        text: "Gutt",
        value: "files/private/profilbilder/boy.png"
    }, {
        text: "Jente",
        value: "files/private/profilbilder/girl.png"
    }
]

