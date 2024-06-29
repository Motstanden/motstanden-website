import {
    Divider,
    Grid,
    Paper,
    SxProps
} from "@mui/material"
import { UserGroup } from "common/enums"
import { User } from "common/interfaces"
import { getFullName, userGroupToPrettyStr, userRankToPrettyStr } from "common/utils"
import dayjs from "dayjs"
import { useState } from 'react'
import { PostingWall } from "src/components/PostingWall"
import { useAuthenticatedUser } from "src/context/Authentication"
import { useTimeZone } from 'src/context/TimeZone'
import { useTitle } from "src/hooks/useTitle"
import { useUserProfileContext } from './Context'
import { Card, CardTextItem, CardTextList } from "./components/Card"

export default function UserPage() {
    const { viewedUser: user } = useUserProfileContext()
    useTitle(user.firstName)
    return (
        <div style={{maxWidth: "1300px"}}>
            <ProfileHeader 
                user={user} 
                sx={{
                    mb: {xs: 2, md: 2, lg: 4}
                }} />
            <Grid container alignItems="top" spacing={{xs: 2, md: 2, lg: 4}}>
                <PersonalDetailsController/>
                <MembershipDetailsController/>
                <AccountDetailsController/>
            </Grid>
            <Divider sx={{my: 4}} />
            <h1>Tidslinje</h1>
            <PostingWall userId={user.id} userFirstName={user.firstName}/>
        </div>
    )
}

function ProfileHeader({ user, sx }: { user: User, sx?: SxProps }) {
    const fullName = getFullName(user)
    return (
        <Paper
            elevation={6}
            style={{ textAlign: "center" }}
            sx={{ ...sx }}
        >
            <h1 style={{ paddingTop: "10px" }}>{fullName}</h1>
            <img
                src={`${window.location.origin}/${user.profilePicture}`}
                alt={`Profilbildet til ${fullName}`}
                style={{
                    width: "90%",
                    maxWidth: "300px",
                    borderRadius: "50%",
                    paddingBottom: "10px"
                }} />
        </Paper>
    )
}

// ********************************************************
//                     CONTROLLERS
// ********************************************************

function PersonalDetailsController() { 
    
    const { user: currentUser, isSuperAdmin} = useAuthenticatedUser()
    const { viewedUser } = useUserProfileContext()
    const [isEditing, setIsEditing] = useState(false)
    
    // People who can edit:
    //  - Super admins
    //  - Users who are viewing their own profile
    const canEdit = isSuperAdmin || currentUser.id === viewedUser.id
    
    if(canEdit && isEditing) 
        return (
            <PersonalDetailsForm 
                initialValue={viewedUser} 
                onCancel={() => setIsEditing(false)}
                onSave={() => setIsEditing(false)}        
        />
    )

    return (
        <PersonalDetailsCard 
            user={viewedUser} 
            showEditMenu={canEdit}
            onEditClick={() => setIsEditing(true)}
        />
    )
}

function MembershipDetailsController() {
    
    const { user: currentUser, isAdmin } = useAuthenticatedUser()
    const { viewedUser } = useUserProfileContext()
    const [isEditing, setIsEditing] = useState(false)

    // People who can edit:
    //  - Admins
    //  - Users who are viewing their own profile
    const canEdit = isAdmin || currentUser.id === viewedUser.id

    if(canEdit && isEditing) 
        return (
            <MembershipDetailsForm 
                initialValue={viewedUser} 
                onCancel={() => setIsEditing(false)}
                onSave={() => setIsEditing(false)}    
             />    
        )

    return (
        <MembershipDetailsCard 
            user={viewedUser} 
            showEditMenu={canEdit}
            onEditClick={() => setIsEditing(true)}
        />
    )
}

function AccountDetailsController() {

    const { viewedUser } = useUserProfileContext()
    const { isSuperAdmin, isAdmin} = useAuthenticatedUser()
    const [isEditing, setIsEditing] = useState(false)

    // People who can edit:
    // - Super admins
    // - Admin, if the viewedUser is not a super admin
    const canEdit = isSuperAdmin || (isAdmin && viewedUser.groupName !== UserGroup.SuperAdministrator)

    if(canEdit && isEditing) 
        return (
            <AccountDetailsForm 
                initialValue={viewedUser} 
                onCancel={() => setIsEditing(false)}
                onSave={() => setIsEditing(false)}        
            />
        )

    return (
        <AccountDetailsCard 
            user={viewedUser}
            showEditMenu={canEdit}
            onEditClick={() => setIsEditing(true)} 
        />
    )
}

// ********************************************************
//                  READ-ONLY CARDS
// ********************************************************


type DetailsCardProps = { 
    user: User, 
    showEditMenu?: boolean,
    onEditClick?: () => void,
}

function PersonalDetailsCard( { user, showEditMenu, onEditClick}: DetailsCardProps) {
    useTimeZone()
    return (
        <Card 
            title="Personalia" 
            showEditButton={showEditMenu} 
            onEditClick={onEditClick}
            editButtonToolTip="Rediger personalia"
            >
            <CardTextList>
                <CardTextItem label="Navn" text={getFullName(user)} />
                <CardTextItem label="Bursdag" text={formatDateStr(user.birthDate)} />
                <CardTextItem label="E-post" text={user.email} />
                <CardTextItem label="Tlf" text={user.phoneNumber?.toString() ?? "-"} />
            </CardTextList>
        </Card>
    )
}

function MembershipDetailsCard({ user, showEditMenu, onEditClick}: DetailsCardProps) {
    useTimeZone()
    return (
        <Card 
            title="Medlemskap"
            showEditButton={showEditMenu}
            onEditClick={onEditClick}
            editButtonToolTip="Rediger medlemskap"
        >
            <CardTextList>
                <CardTextItem label="Kappe" text={user.capeName ? user.capeName : "-"} />
                <CardTextItem label="Rang" text={userRankToPrettyStr(user.rank)} />
                <CardTextItem label="Status" text={user.status} />
                <CardTextItem label="Aktiv periode" text={formatDateInterval(user.startDate, user.endDate)} />
            </CardTextList>
        </Card>
    )
}

function AccountDetailsCard({ user, showEditMenu, onEditClick}: DetailsCardProps) {
    useTimeZone()
    return (
        <Card 
            title="Brukerkonto"
            showEditButton={showEditMenu}
            onEditClick={onEditClick}
            editButtonToolTip="Rediger brukerkonto"
        >
            <CardTextList>
                <CardTextItem label="Rolle" text={userGroupToPrettyStr(user.groupName)} />
                <CardTextItem label="Opprettet" text={formatExactDate(user.createdAt)} />
                <CardTextItem label="Oppdatert" text={formatExactDate(user.updatedAt)} />
            </CardTextList>
        </Card>
    )

}

// ********************************************************
//                          FORMS
// ********************************************************


type DetailsFormProps = {
    initialValue: User,
    onCancel?: () => void,
    onSave?: () => void,
}

function PersonalDetailsForm( { initialValue, onCancel, onSave }: DetailsFormProps) {
    return (
        <>TODO...</>
    )
}

function MembershipDetailsForm( { initialValue, onCancel, onSave }: DetailsFormProps) {
    return (
        <>TODO...</>
    )
}

function AccountDetailsForm( { initialValue, onCancel, onSave }: DetailsFormProps) {
    return (
        <>TODO...</>
    )
}

// ********************************************************
//                     FORMATTERS
// ********************************************************

function formatExactDate(dateStr: string): string {
    return dayjs.utc(dateStr).tz().format("DD MMM YYYY HH:mm:ss")
}

function formatDateStr(dateStr: string | null): string {
    if (!dateStr)
        return "-"
    return dayjs.utc(dateStr).tz().format("DD MMMM YYYY")
}

function formatDateInterval(startDate: string, endDate: string | null): string {
    let result = dayjs.utc(startDate).tz().format("MMMM YYYY") + " - "
    result += endDate ? dayjs.utc(endDate).tz().format("MMMM YYYY") : "dags dato"
    return result
}