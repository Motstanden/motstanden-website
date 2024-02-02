import {
    Box,
    Grid,
    MenuItem,
    Stack,
    TextField
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useQueryClient } from "@tanstack/react-query";
import { UserEditMode, UserGroup, UserRank, UserStatus } from "common/enums";
import { User } from "common/interfaces";
import { isNtnuMail as checkIsNtnuMail, isNullOrWhitespace, strToNumber, userRankToPrettyStr } from "common/utils";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { datePickerStyle } from "src/assets/style/timePickerStyles";
import { HelpButton } from "src/components/HelpButton";
import { Form } from "src/components/form/Form";
import { useAuthenticatedUser, userQueryKey } from "src/context/Authentication";
import { useTitle } from "src/hooks/useTitle";
import { useUserProfileContext, userListQueryKey } from "./Context";
import { AccountDetailsCard, PersonCard, formatExactDate } from "./UserPage";
import { Card, CardTextItem } from "./components/Card";
import { groupTVPair, rankTVPair, statusTVPair } from "./utils/TextValuePair";

export default function EditUserPage() {
    const {user, isAdmin, isSuperAdmin} = useAuthenticatedUser()
    const { viewedUser } = useUserProfileContext()

    const isSelfEditing = user.id === viewedUser.id

    let editMode: UserEditMode | undefined
    if (isSuperAdmin) {
        editMode = UserEditMode.SuperAdmin
    }
    else if (isSelfEditing && isAdmin) {
        editMode = UserEditMode.SelfAndAdmin
    }
    else if (isSelfEditing) {
        editMode = UserEditMode.Self
    }
    else if (isAdmin) {
        editMode = UserEditMode.Admin
    }

    if (editMode) {
        return <EditPage editMode={editMode} user={viewedUser} />
    }

    return <Navigate to={`/medlem/${viewedUser.id}`} replace />
}

function EditPage({ editMode, user }: { editMode: UserEditMode, user: User }) {
    const [newUser, setNewUser] = useState<User>(user)
    const [disableSubmit, setDisableSubmit] = useState(false)
    
    const queryClient = useQueryClient()

    useTitle(user.firstName + `${isUserEqual(user, newUser) ? "" : "*"}`)
    const navigate = useNavigate()

    const onChange = (user: User) => setNewUser(user);
    const onIsValidChange = (isValid: boolean) => setDisableSubmit(!isValid)

    const onAbort = () => {
        if(canExitPage(user, newUser)){
            navigate("..", {replace: true})
        } 
    }
    const onPostSuccess = async (_: Response) => {
        await queryClient.invalidateQueries({queryKey: userQueryKey})
        await queryClient.invalidateQueries({queryKey: userListQueryKey})
        navigate("..", {replace: true})
    }

    return (
        <Form
            value={newUser}
            postUrl={getPostUrl(editMode)}
            disabled={isUserEqual(user, newUser) || disableSubmit}
            onAbortClick={onAbort}
            onPostSuccess={onPostSuccess}
        >
            <Grid container alignItems="top" spacing={4}>
                <PersonForm value={newUser} onChange={onChange} onIsValidChange={onIsValidChange} editMode={editMode} />
                <MemberForm value={newUser} onChange={onChange} onIsValidChange={onIsValidChange} editMode={editMode} />
                <AccountDetailsForm value={newUser} onChange={onChange} onIsValidChange={onIsValidChange} editMode={editMode} />
            </Grid>
        </Form>
    )
}

function PersonForm({ value, onChange, onIsValidChange, editMode }: FormParams) {
    const [isValid, setIsValid] = useState(true)
    useEffect(() => onIsValidChange(isValid), [isValid])

    const isSelf = editMode === UserEditMode.Self || editMode === UserEditMode.SelfAndAdmin
    const isSuperAdmin = editMode === UserEditMode.SuperAdmin
    if (!isSelf && !isSuperAdmin) {
        return <PersonCard user={value} />
    }

    const isNtnuMail = checkIsNtnuMail(value.email)
    const isValidPhone = value.phoneNumber === null || (value.phoneNumber >= 10000000 && value.phoneNumber <= 99999999)

    const userIsValid = !isNtnuMail && isValidPhone && !isNullOrWhitespace(value.firstName) && !isNullOrWhitespace(value.lastName)
    const validChanged = (userIsValid && !isValid) || (!userIsValid && isValid)
    if (validChanged) {
        setIsValid(prev => !prev)
    }

    return (
        <Card title="Personalia" spacing={4}>
            <TextField
                label="Fornavn"
                name="firstName"
                value={value.firstName}
                onChange={e => onChange({ ...value, firstName: e.target.value })}
                required
                sx={{ mt: 2 }}
            />
            <TextField
                label="Mellomnavn"
                name="middleName"
                value={value.middleName}
                onChange={e => onChange({ ...value, middleName: e.target.value })}
            />
            <TextField
                label="Etternavn"
                name="lastName"
                value={value.lastName}
                onChange={e => onChange({ ...value, lastName: e.target.value })}
                required
            />
            <DatePicker
                {...datePickerStyle}
                views={["year", "month", "day"]}
                label="Fødselsdato"
                minDate={dayjs().subtract(100, "year")}
                maxDate={dayjs().subtract(18, "year")}
                value={value.birthDate ? dayjs(value.birthDate) : null}
                onChange={(newVal: Dayjs | null) => onChange({ ...value, birthDate: newVal?.format("YYYY-MM-DD") ?? null })}
            />
            <div>
                <TextField
                    label="E-post"
                    name="email"
                    value={value.email}
                    onChange={e => onChange({ ...value, email: e.target.value })}
                    error={isNtnuMail}
                    fullWidth
                    required
                />
                {isNtnuMail && <div color="error.main">Ntnu mail ikke tillat</div>}
            </div>
            <div>
                <TextField
                    type="tel"
                    label="Tlf."
                    name="phoneNumber"
                    value={value.phoneNumber ?? ""}
                    fullWidth
                    onChange={e => {
                        const newVal = strToNumber(e.target.value) ?? null
                        const inRange = newVal && newVal < 99999999
                        const isEmpty = e.target.value.length === 0
                        if (inRange || isEmpty) {
                            onChange({ ...value, phoneNumber: newVal })
                        }
                    }}
                />
                {!isValidPhone && "Ugyldig nummer"}
            </div>
        </Card>
    )
}

function MemberForm({ value, onChange, editMode }: FormParams) {
    const isAdmin = hasAdminAccess(editMode)

    const userStatusSrc = isAdmin
        ? statusTVPair
        : statusTVPair.filter(item => item.value !== UserStatus.Inactive)

    return (
        <Card title="Medlemskap" spacing={4}>
            <TextField
                label="Kappe"
                name="capeName"
                fullWidth
                value={value.capeName}
                onChange={e => onChange({ ...value, capeName: e.target.value })}
                sx={{ mt: 2 }}
            />
            {isAdmin && (
                <TextField
                    select
                    label="Rang"
                    name="userRank"
                    required
                    value={value.rank}
                    onChange={(e) => onChange({ ...value, rank: e.target.value as UserRank })}
                >
                    {rankTVPair.map(item => (<MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>))}
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
                    <CardTextItem label="Rang" text={userRankToPrettyStr(value.rank)} />
                </div>
            )}
            <Stack direction="row" alignItems="center">
                <TextField
                    select
                    fullWidth
                    label="Status"
                    name="userStatus"
                    required
                    value={value.status}
                    onChange={e => onChange({ ...value, status: e.target.value as UserStatus })}
                >
                    {userStatusSrc.map(item => (<MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>))}
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
                onChange={(newVal: Dayjs | null) => newVal && onChange({ ...value, startDate: newVal?.format("YYYY-MM-DD") })}
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
                onChange={(newVal: Dayjs | null) => onChange({ ...value, endDate: newVal?.format("YYYY-MM-DD") ?? null })}
                slotProps={{
                    textField: { required: true }
                }}
            />
        </Card>
    )
}

function AccountDetailsForm({ value, onChange, editMode }: FormParams) {

    if (!hasAdminAccess(editMode)) {
        return <AccountDetailsCard user={value} />
    }

    const isSuperAdmin = editMode === UserEditMode.SuperAdmin
    const groupSource = isSuperAdmin
        ? groupTVPair
        : groupTVPair.filter(item => item.value !== UserGroup.SuperAdministrator)

    return (
        <Card title="Brukerkonto" spacing={4}>
            <TextField
                select
                label="Rolle"
                name="groupName"
                required
                sx={{ mt: 2 }}
                value={value.groupName}
                onChange={(e) => onChange({ ...value, groupName: e.target.value as UserGroup })}
            >
                {groupSource.map(item => (<MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>))}
            </TextField>
            <div style={{ paddingLeft: "10px" }}>
                <CardTextItem label="Laget" text={formatExactDate(value.createdAt)} />
            </div>
            <div style={{ paddingLeft: "10px" }}>
                <CardTextItem label="Oppdatert" text={formatExactDate(value.updatedAt)} />
            </div>
        </Card>
    )
}

type FormParams = {
    value: User,
    editMode: UserEditMode,
    onChange: (value: User) => void,
    onIsValidChange: (isValid: boolean) => void
}


function canExitPage(oldUser: User, newUser: User): boolean {
    if (!isUserEqual(oldUser, newUser)) {
        return window.confirm("Du har ikke lagret endringene\nVil du avslutte redigering av profil?")
    }
    return true
}

function isUserEqual(oldUser: User, newUser: User): boolean {
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

function getPostUrl(mode: UserEditMode): string {
    switch (mode) {
        case UserEditMode.Self: return "/api/self/update-user"
        case UserEditMode.Admin: return "/api/admin/update-user"
        case UserEditMode.SelfAndAdmin: return "/api/self-and-admin/update-user"
        case UserEditMode.SuperAdmin: return "/api/super-admin/update-user"
    }
}

function getStatusExplanation(status: UserStatus): string {
    switch (status) {
        case UserStatus.Active: return "Aktiv: Aktivt medlem av motstanden"
        case UserStatus.Veteran: return "Veteran: Medlem som generelt ikke er aktiv, men som likevel deltar på ting av og til (f.eks SMASH og Forohming)"
        case UserStatus.Retired: return "Pensjonist: Medlem som hverken er aktiv eller deltar på ting. Medlemmet deltar kanskje på større jubileum."
        case UserStatus.Inactive: return "Inaktiv: Medlem som sluttet kort tid etter at vedkommende ble medlem"
    }
}

function hasAdminAccess(mode: UserEditMode): boolean {
    return mode === UserEditMode.Admin ||
        mode === UserEditMode.SelfAndAdmin ||
        mode === UserEditMode.SuperAdmin
}
