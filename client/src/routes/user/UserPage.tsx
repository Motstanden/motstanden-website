import {
    Divider,
    Grid,
    MenuItem,
    Paper,
    SxProps,
    TextField
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { useQueryClient } from "@tanstack/react-query"
import { UserGroup } from "common/enums"
import { UpdateUserPersonalInfoBody, UpdateUserRoleBody, User } from "common/interfaces"
import { isNtnuMail as checkIsNtnuMail, getFullName, isNullOrWhitespace, strToNumber, userGroupToPrettyStr, userRankToPrettyStr } from "common/utils"
import dayjs, { Dayjs } from "dayjs"
import { useState } from 'react'
import { datePickerStyle } from "src/assets/style/timePickerStyles"
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

function PersonalDetailsForm( { initialValue, onCancel, onSave }: DetailsFormProps) {
    
    const { id } = initialValue
    const [value, setValue] = useState<UpdateUserPersonalInfoBody>(getPersonalDetailsBody(initialValue))

    const { user } = useAuthenticatedUser()
    const invalidateUserQueries = useUserQueryInvalidation()

    const onPostSuccess = async () => { 
        await invalidateUserQueries()
        onSave?.()
    }

    // Validate form
    const isNtnuMail = checkIsNtnuMail(value.email)
    const isValidPhone = value.phoneNumber === null || (value.phoneNumber >= 10000000 && value.phoneNumber <= 99999999)

    const disabled = isNtnuMail ||
        !isValidPhone || 
        isNullOrWhitespace(value.firstName) || 
        isNullOrWhitespace(value.lastName) ||
        isEqualUsers(value, getPersonalDetailsBody(initialValue))

    // Posting to /users/:id requires super admin rights
    const url = user.id === id 
        ? "/api/users/me/personal-info" 
        : `/api/users/${id}/personal-info`

    return (
        <Form
            value={() => trimPersonalInfo(value)}
            url={url}
            httpVerb="PUT"
            disabled={disabled}
            // noDivider
            onSuccess={onPostSuccess}
            onAbortClick={onCancel}
            noPadding
        >
            <Card 
                title="Personalia"
                showEditButton={false}
                spacing={4}
                stackSx={{ py: 1 }}
                sx={{ mb: 4 }}
            >
                <TextField
                    label="Fornavn"
                    value={value.firstName}
                    onChange={e => setValue( prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    sx={{ mt: 2 }}
                />
                <TextField
                    label="Mellomnavn"
                    value={value.middleName}
                    onChange={e => setValue( prev => ({ ...prev, middleName: e.target.value }))}
                />
                <TextField
                    label="Etternavn"
                    value={value.lastName}
                    onChange={e => setValue( prev => ({ ...prev, lastName: e.target.value }))}
                    required
                />
                <DatePicker
                    {...datePickerStyle}
                    views={["year", "month", "day"]}
                    label="Fødselsdato"
                    value={value.birthDate ? dayjs(value.birthDate) : null}
                    onChange={ (newVal: Dayjs | null) => {
                        const newDate = newVal?.format("YYYY-MM-DD") ?? null
                        setValue( prev => ({ ...prev, birthDate: newDate }))
                    }}
                />
                <div>
                    <TextField
                        label="E-post"
                        type="email"
                        value={value.email}
                        onChange={e => setValue( prev => ({ ...prev, email: e.target.value }))}
                        error={isNtnuMail}
                        fullWidth
                        required
                    />
                    {isNtnuMail && "Ntnu mail ikke tillat"}
                </div>
                <div>
                    <TextField
                        type="tel"
                        label="Tlf."
                        value={value.phoneNumber ?? ""}
                        fullWidth
                        onChange={e => {
                            const newVal = strToNumber(e.target.value) ?? null
                            const inRange = newVal && newVal < 99999999
                            const isEmpty = e.target.value.length === 0
                            if (inRange || isEmpty) {
                                setValue(prev => ({ ...prev, phoneNumber: newVal }))
                            }
                        }}
                    />
                    {!isValidPhone &&  "Ugyldig nummer"}
                </div>   
            </Card>

        </Form>
    )
}

function getPersonalDetailsBody(user: User): UpdateUserPersonalInfoBody { 
    return {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        birthDate: user.birthDate
    }
}

function trimPersonalInfo(user: UpdateUserPersonalInfoBody): UpdateUserPersonalInfoBody { 
    return {
        firstName: user.firstName.trim(),
        middleName: user.middleName?.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim(),
        phoneNumber: user.phoneNumber,
        birthDate: user.birthDate?.trim() ?? null
    }
}

// **************** Membership Details Form *****************

function MembershipDetailsForm( { initialValue, onCancel, onSave }: DetailsFormProps) {
    return (
        <>TODO...</>
    )
}

// **************** Account Details Form *****************

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


function isEqualUsers(oldUser: Partial<User>, newUser: Partial<User>): boolean {
    return (
        oldUser.birthDate === newUser.birthDate &&
        oldUser.capeName === newUser.capeName &&
        oldUser.email === newUser.email &&
        oldUser.endDate === newUser.endDate &&
        oldUser.firstName === newUser.firstName &&
        oldUser.groupName === newUser.groupName &&
        oldUser.lastName === newUser.lastName &&
        oldUser.middleName === newUser.middleName &&
        oldUser.phoneNumber === newUser.phoneNumber &&
        oldUser.profilePicture === newUser.profilePicture &&
        oldUser.rank === newUser.rank &&
        oldUser.startDate === newUser.startDate &&
        oldUser.status === newUser.status
    )
}
