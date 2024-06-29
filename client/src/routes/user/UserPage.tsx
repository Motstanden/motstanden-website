import {
    Box,
    Divider,
    Grid,
    MenuItem,
    Paper,
    Stack,
    SxProps,
    TextField
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { useQueryClient } from "@tanstack/react-query"
import { UserGroup, UserRank, UserStatus } from "common/enums"
import { UpdateUserMembershipAsAdminBody, UpdateUserMembershipAsMeBody, UpdateUserPersonalInfoBody, UpdateUserRoleBody, User } from "common/interfaces"
import { isNtnuMail as checkIsNtnuMail, getFullName, isNullOrWhitespace, strToNumber, userGroupToPrettyStr, userRankToPrettyStr, userStatusToPrettyStr } from "common/utils"
import dayjs, { Dayjs } from "dayjs"
import { useState } from 'react'
import { datePickerStyle } from "src/assets/style/timePickerStyles"
import { HelpButton } from "src/components/HelpButton"
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
            <ProfileInfoGrid />
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

function ProfileInfoGrid() {
    return (
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

function PersonalDetailsCard( { user, showEditMenu, onEditClick }: DetailsCardProps) {
    useTimeZone()
    return (
        <Card 
            title="Personalia" 
            showEditButton={showEditMenu} 
            onEditClick={onEditClick}
            editButtonToolTip="Rediger personalia"
            sx={{
                height: "100%",
                maxHeight: "512px"  // Height of membership form
            }}
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

function MembershipDetailsCard({ user, showEditMenu, onEditClick }: DetailsCardProps) {
    useTimeZone()
    return (
        <Card 
            title="Medlemskap"
            showEditButton={showEditMenu}
            onEditClick={onEditClick}
            editButtonToolTip="Rediger medlemskap"
            sx={{
                minHeight: "MIN(312px, 100%)"   // Looks good when the user is editing personal details 
            }}
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

function AccountDetailsCard({ user, showEditMenu, onEditClick }: DetailsCardProps) {
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
    const { isSuperAdmin } = useAuthenticatedUser()
    const [value, setValue] = useState<UpdateUserPersonalInfoBody>(getPersonalDetailsBody(initialValue))

    // Validate form
    const isNtnuMail = checkIsNtnuMail(value.email)
    const isValidPhone = value.phoneNumber === null || (value.phoneNumber >= 10000000 && value.phoneNumber <= 99999999)

    const disabled = isNtnuMail ||
        !isValidPhone || 
        isNullOrWhitespace(value.firstName) || 
        isNullOrWhitespace(value.lastName) ||
        isEqualUsers(value, getPersonalDetailsBody(initialValue))

    // Posting to /users/:id requires super admin rights
    const url = isSuperAdmin
        ? `/api/users/${id}/personal-info`
        : "/api/users/me/personal-info" 

    return (
        <FormCard
            title="Personalia"
            value={() => trimPersonalInfo(value)}
            httpVerb="PUT"
            url={url}
            disabled={disabled}
            onSuccess={onSave}
            onAbortClick={onCancel}
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
        </FormCard>
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

type MembershipBody = UpdateUserMembershipAsAdminBody | UpdateUserMembershipAsMeBody

function MembershipDetailsForm( { initialValue, onCancel, onSave }: DetailsFormProps) {
    const { id } = initialValue
    const { isAdmin } = useAuthenticatedUser()

    const getBody = (value: User) => isAdmin
        ? getMembershipAsAdminBody(value)
        : getMembershipAsMeBody(value)

    const [value, setValue] = useState<MembershipBody>(getBody(initialValue))

    const disabled = isEqualUsers(value, getBody(initialValue))

    const httpVerb = isAdmin ? "PUT" : "PATCH"
    const url = isAdmin
        ? `/api/users/${id}/membership`
        : "/api/users/me/membership"


    return (
        <FormCard
            title="Medlemskap"
            value={() => trimMembershipBody(value)}
            httpVerb={httpVerb}
            url={url}
            onSuccess={onSave}
            onAbortClick={onCancel}
            disabled={disabled}
        >
            <TextField
                label="Kappe"
                fullWidth
                value={value.capeName}
                onChange={e => setValue( prev => ({ ...prev, capeName: e.target.value }))}
            />
            {isAdmin && isAdminBody(value) && (
                <TextField
                    select
                    label="Rang"
                    required
                    value={value.rank}
                    onChange={e => setValue( prev => ({ ...prev, rank: e.target.value as UserRank }))}
                >
                    {Object.values(UserRank).map(rank => (
                        <MenuItem key={rank} value={rank}>
                            {userRankToPrettyStr(rank)}
                        </MenuItem>
                    ))}
                </TextField>
            )}
            {!isAdmin && (
                <div style={{
                    minHeight: "56px",
                    paddingLeft: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    <CardTextItem label="Rang" text={userRankToPrettyStr(initialValue.rank)} />
                </div>
            )}
            <Stack direction="row" alignItems="center">
                <TextField
                    select
                    fullWidth
                    label="Status"
                    required
                    value={value.status}
                    onChange={e => setValue( prev => ({ ...prev, status: e.target.value as UserStatus }))}
                >
                    {Object.values(UserStatus).map(status => (
                        <MenuItem key={status} value={status}>
                            {userStatusToPrettyStr(status)}
                        </MenuItem>
                    ))}
                </TextField>
                <Box sx={{ ml: 2 }}>
                    <HelpButton>
                        {getStatusExplanation(value.status)}
                    </HelpButton>
                </Box>
            </Stack>
            <DatePicker
                {...datePickerStyle}
                views={["year", "month"]}
                label="Startet"
                minDate={dayjs().year(2018).month(7)}
                maxDate={dayjs()}
                value={dayjs(value.startDate)}
                onChange={(newVal: Dayjs) => {
                    const newDate = newVal.format("YYYY-MM-DD")
                    setValue( prev => ({ ...prev, startDate: newDate }))
                }}
                slotProps={{
                    textField: { required: true }
                }}
            />
            <DatePicker
                {...datePickerStyle}
                views={["year", "month"]}
                label="Sluttet"
                minDate={dayjs().year(2018).month(7)}
                maxDate={dayjs().add(6, "year")}
                value={value.endDate ? dayjs(value.endDate) : null}
                onChange={(newVal: Dayjs | null) => {
                    const newDate = newVal?.format("YYYY-MM-DD") ?? null
                    setValue( prev => ({ ...prev, endDate: newDate }))
                }}
            />
        </FormCard>
    )
}

function getMembershipAsAdminBody(user: User): UpdateUserMembershipAsAdminBody {
    return {
        capeName: user.capeName,
        rank: user.rank,
        status: user.status,
        startDate: user.startDate,
        endDate: user.endDate
    }
}

function getMembershipAsMeBody(user: User): UpdateUserMembershipAsMeBody {
    return {
        capeName: user.capeName,
        status: user.status,
        startDate: user.startDate,
        endDate: user.endDate
    }
}

function trimMembershipBody(user: MembershipBody): MembershipBody {
    return {
        ...user,
        capeName: user.capeName.trim(),
        startDate: user.startDate.trim(),
        endDate: user.endDate?.trim() ?? null
    }
}

const isAdminBody = (body: MembershipBody): body is UpdateUserMembershipAsAdminBody => { 
    return (body as UpdateUserMembershipAsAdminBody).rank !== undefined
}

function getStatusExplanation(status: UserStatus): string {
    switch (status) {
        case UserStatus.Active: return "Aktiv: Aktivt medlem av motstanden"
        case UserStatus.Veteran: return "Veteran: Medlem som generelt ikke er aktiv, men som likevel deltar på ting av og til (f.eks SMASH og Forohming)"
        case UserStatus.Retired: return "Pensjonist: Medlem som hverken er aktiv eller deltar på ting. Medlemmet deltar kanskje på større jubileum."
        case UserStatus.Inactive: return "Inaktiv: Medlem som sluttet kort tid etter at vedkommende ble medlem"
    }
}

// **************** Account Details Form *****************

function AccountDetailsForm( { initialValue, onCancel, onSave }: DetailsFormProps) {

    const { id, createdAt, updatedAt } = initialValue

    const [value, setValue] = useState<UpdateUserRoleBody>({  
        groupName: initialValue.groupName 
    })

    const { isSuperAdmin } = useAuthenticatedUser()

    const disabled = value.groupName === initialValue.groupName

    return (
        <FormCard
            title="Brukerkonto"
            value={value}
            httpVerb="PUT"
            url={`/api/users/${id}/role`}
            disabled={disabled}
            noDivider
            onSuccess={onSave}
            onAbortClick={onCancel}
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
        </FormCard>
    )
}

function FormCard({
    title,
    value,
    children,
    disabled,
    url,
    onSuccess,
    onAbortClick,
    noDivider,
    httpVerb = "POST"
}: {
    title: string
    value: object | (() => object)    // Either any object, or a callback function that returns the object
    children: React.ReactNode
    url: string
    disabled?: boolean
    preventSubmit?: () => boolean
    onSuccess?: (() => Promise<void>) | (() => void)
    onFailure?: () => void
    onAbortClick?: React.MouseEventHandler<HTMLButtonElement>
    noDivider?: boolean
    httpVerb?: "POST" | "PATCH" | "PUT"
}) {

    const queryClient = useQueryClient()

    const handleOnSuccess = async () => { 
        await Promise.all([
            queryClient.invalidateQueries({queryKey: userQueryKey}),
            queryClient.invalidateQueries({queryKey: userListQueryKey})
        ])
        await onSuccess?.()   
    }

    return (
        <Form
            value={value}
            httpVerb={httpVerb}
            url={url}
            disabled={disabled}
            onSuccess={handleOnSuccess}
            onAbortClick={onAbortClick}
            noPadding
            noDivider={noDivider}
        >
            <Card 
                title={title}
                showEditButton={false}
                sx={{ 
                    mb: 3,
                }}
                stackSx={{ py: 1 }}
                spacing={4}
            >
                {children}
            </Card>
        </Form>
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
