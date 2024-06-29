import {
    Divider,
    Grid,
    MenuItem,
    Paper,
    SxProps,
    TextField
} from "@mui/material"
import { useQueryClient } from "@tanstack/react-query"
import { UserGroup } from "common/enums"
import { UpdateUserRoleBody, User } from "common/interfaces"
import { getFullName, userGroupToPrettyStr, userRankToPrettyStr } from "common/utils"
import dayjs from "dayjs"
import { useState } from 'react'
import { PostingWall } from "src/components/PostingWall"
import { Form } from "src/components/form/Form"
import { useAuthenticatedUser, userQueryKey } from "src/context/Authentication"
import { useTimeZone } from 'src/context/TimeZone'
import { useTitle } from "src/hooks/useTitle"
import { useUserProfileContext, userListQueryKey } from './Context'
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
                <Grid item xs={12} md={6}>
                    <PersonalDetailsController/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <MembershipDetailsController/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <AccountDetailsController/>
                </Grid>
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PersonalDetailsForm( { initialValue, onCancel, onSave }: DetailsFormProps) {
    return (
        <>TODO...</>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MembershipDetailsForm( { initialValue, onCancel, onSave }: DetailsFormProps) {
    return (
        <>TODO...</>
    )
}

function AccountDetailsForm( { initialValue, onCancel, onSave }: DetailsFormProps) {

    const { id, createdAt, updatedAt } = initialValue

    const [value, setValue] = useState<UpdateUserRoleBody>({  
        groupName: initialValue.groupName 
    })

    const { isSuperAdmin } = useAuthenticatedUser()
    const invalidateUserQueries = useUserQueryInvalidation()

    const onPostSuccess = async () => { 
        await invalidateUserQueries()
        onSave?.()
    }

    const disabled = value.groupName === initialValue.groupName

    return (
        <Form
            value={value}
            httpVerb="PUT"
            url={`/api/users/${id}/role`}
            disabled={disabled}
            noDivider
            onSuccess={onPostSuccess}
            onAbortClick={onCancel}
            noPadding
        >
            <Card 
                title="Brukerkonto" 
                showEditButton={false} 
                sx={{ mb: 2 }}
                stackSx={{ py: 1 }}
                >
                <TextField
                    select
                    label="Rolle"
                    required
                    value={value.groupName}
                    onChange={(e) => setValue({ groupName: e.target.value as UserGroup })}
                >
                    <MenuItem value={UserGroup.Contributor}>
                        {userGroupToPrettyStr(UserGroup.Contributor)}
                    </MenuItem>
                    <MenuItem value={UserGroup.Editor}>
                        {userGroupToPrettyStr(UserGroup.Editor)}
                    </MenuItem>
                    <MenuItem value={UserGroup.Administrator}>
                        {userGroupToPrettyStr(UserGroup.Administrator)}
                    </MenuItem>
                    {isSuperAdmin && (
                        <MenuItem value={UserGroup.SuperAdministrator}>
                            {userGroupToPrettyStr(UserGroup.SuperAdministrator)}
                        </MenuItem>
                    )}
                </TextField>

                <CardTextList style={{marginLeft: "5px", marginTop: "25px"}}>
                    <CardTextItem 
                        label="Laget" 
                        text={formatExactDate(createdAt)} 
                        labelStyle={{marginBottom: "5px"}}
                        textStyle={{marginBottom: "5px"}}
                        />
                    <CardTextItem label="Oppdatert" text={formatExactDate(updatedAt)} />
                </CardTextList>
            </Card>
        </Form>
    )
}

function useUserQueryInvalidation() {
    const queryClient = useQueryClient()

    const invalidateUserQueries = async () => {
        await Promise.all([
            queryClient.invalidateQueries({queryKey: userQueryKey}),
            queryClient.invalidateQueries({queryKey: userListQueryKey})
        ])
    }

    return invalidateUserQueries
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