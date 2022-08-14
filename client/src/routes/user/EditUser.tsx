import { Box, Button, Divider, Grid, Paper, TextField } from "@mui/material";
import { UserGroup } from "common/enums";
import { User } from "common/interfaces";
import { hasGroupAccess } from "common/utils";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useAuth } from "src/context/Authentication";
import { PageContainer } from "src/layout/PageContainer";
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack } from "@mui/system";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { strToNumber } from "common/utils"
import { Card } from "./Components";
import { AccountDetailsCard } from "./UserPage";
import { validateEmail } from 'src/utils/validateEmail';
import { isNullOrWhitespace } from "src/utils/isNullOrWhitespace";

export function EditUserPage () {
    
    const currentUser = useAuth().user!
    const viewedUser = useOutletContext<User>()
    
    if(hasGroupAccess(currentUser, UserGroup.SuperAdministrator)) {
        return <SuperAdminEdit user={viewedUser}/>
    }

    if(currentUser.userId === viewedUser.userId) {
        return <SelfEditPage user={viewedUser}/>
    }

    if(hasGroupAccess(currentUser, UserGroup.Administrator)) {
        return <AdminEdit user={viewedUser}/>
    }

    return <Navigate to={`/medlem/${viewedUser.userId}`}/>
}

function EditForm( {
    user, 
    newUser, 
    children,
    disabled
}: { 
    user: User, 
    newUser: User, 
    children: React.ReactNode 
    disabled?: boolean
}) {
    const navigate = useNavigate()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()        
        setIsSubmitting(true)        
    } 

    const onAbort = () => {
        if(canExitPage(user, newUser)){
            navigate(`/medlem/${user.userId}`)
        }
    }


    return (
        <>
            <form onSubmit={onSubmit}>
                <Grid container alignItems="top" spacing={4}>
                    {children}
                </Grid>
                <br/>
                <br/>
                <br/>
                <SubmitFormButtons loading={isSubmitting} onAbort={onAbort} disabled={isUserEqual(user, newUser) || disabled}/>
            </form>
            <Divider sx={{my: 3}}/>
        </>
    )
}

function SelfEditPage({user}: {user: User}){

    // Can edit all BUT:
    //  - Role
    //  - Rank
    //  - Set themselves as Inactive
    // If admin, they can edit admin stuff too
    const [newUser, setNewUser] = useState<User>(user)
    const [disableSubmit, setDisableSubmit] = useState(false)

    return (
        <EditForm user={user} newUser={newUser} disabled={disableSubmit}>    
            <PersonForm value={newUser} onChange={e => setNewUser(e)} onIsValidChange={ isValid => setDisableSubmit(!isValid)}/>
            <MemberForm value={newUser} onChange={e => setNewUser(e)}/>
            <AccountDetailsCard user={user}/>
        </EditForm>
    )
}

function AdminEdit({user}: {user: User}) {
    
    // Can edit:
    //  - Rank
    //  - Status
    //  - Active period
    //  - Role (up to admin)

    const [newUser, setNewUser] = useState<User>(user)
    return (
        <EditForm user={user} newUser={newUser}>            
            Admin redigering
        </EditForm>
    )
} 

function SuperAdminEdit({user}: {user: User}) {
    
    // Can edit:
    //  - All

    const [newUser, setNewUser] = useState<User>(user)
    return (
        <EditForm user={user} newUser={newUser}>            
            Super admin redigering
        </EditForm>
    )
}


function PersonForm({value, onChange, onIsValidChange}: {value: User, onChange: (value: User) => void, onIsValidChange: (isValid: boolean) => void }) {
    const [isValid, setIsValid] = useState(true)
    useEffect( () => onIsValidChange(isValid), [isValid])

    const isNtnuMail = value.email.trim().toLowerCase().endsWith("ntnu.no")
    const isValidEmail = validateEmail(value.email)
    const isValidPhone = value.phoneNumber === null || ( value.phoneNumber >= 10000000 && value.phoneNumber <= 99999999)  

    const userIsValid = !isNtnuMail && isValidEmail && isValidPhone && !isNullOrWhitespace(value.firstName) && !isNullOrWhitespace(value.lastName)
    const validChanged = ( userIsValid && !isValid ) || ( !userIsValid && isValid )  
    if(validChanged) {
        setIsValid( prev => !prev)
    }    
    
    return (
        <Card title="Personalia" spacing={4}>
            <TextField
                label="Fornavn"
                name="firstName"
                value={value.firstName}
                onChange={ e => onChange({...value, firstName: e.target.value}) }
                required
                sx={{mt: 2}}
            />
            <TextField 
                label="Mellomnavn"
                name="middleName"
                value={value.middleName}
                onChange={ e => onChange({...value, middleName: e.target.value})}
            />
            <TextField
                label="Etternavn"
                name="lastName"
                value={value.lastName}
                onChange={ e => onChange({...value, lastName: e.target.value})}
                required
            />
            <DatePicker
                views={["year", "month", "day"]}
                label="Fødselsdato"
                minDate={dayjs().subtract(100, "year")}
                maxDate={dayjs().subtract(18, "year")}
                value={value.birthDate ? dayjs(value.birthDate) : null}
                onChange={ (newVal: Dayjs | null) => onChange({...value, birthDate: newVal?.format("YYYY-MM-DD") ?? null})}
                renderInput={ params => <TextField {...params} />}
            />
            <div>
                <TextField 
                    label="E-post"
                    name="email"
                    type="email"
                    value={value.email}
                    onChange={ e => onChange({...value, email: e.target.value})}
                    error={isNtnuMail || !isValidEmail}
                    fullWidth
                    required
                    />
                {isNtnuMail && <Box color="error.main">Ntnu mail ikke tillat</Box>}
                {!isValidEmail && <Box color="error.main">Ugylding E-post</Box>}
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
                        if( inRange || isEmpty ) {
                            onChange({...value, phoneNumber: newVal })
                        }
                    }}
                    />
                    {!isValidPhone && "Ugyldig nummer"}
            </div>
        </Card>  
    )
}

function MemberForm({value, onChange}: {value: User, onChange: (value: User) => void }){
    return (
        <Card title="Medlemskap" spacing={4}>

        </Card>
    )
}

function SubmitFormButtons( { 
    loading, 
    onAbort, 
    disabled
}: { 
    loading?: boolean, 
    onAbort: React.MouseEventHandler<HTMLButtonElement> | undefined
    disabled?: boolean,
}) {
    return (
        <Stack direction="row" justifyContent="space-between">
            <Button
                startIcon={<ArrowBackIcon/>} 
                color="error" 
                variant="outlined"
                disabled={loading}
                onClick={onAbort} 
                style={{
                    minWidth: "120px"
                }}
                >
                Avbryt
            </Button>
            <LoadingButton 
                type="submit"
                loading={loading}
                endIcon={<SaveIcon/>}
                variant="contained"
                loadingPosition="end"
                disabled={disabled}
                style={{
                    minWidth: "120px"
                }}
                >
                Lagre
            </LoadingButton>
        </Stack>
    )
}

function canExitPage(oldUser: User, newUser: User): boolean {
    if(!isUserEqual(oldUser, newUser)){
        return window.confirm("Du har ikke lagret endringene\nVil du avslutte redigering av profil?")
    }
    return true
}

function isUserEqual(oldUser: User, newUser: User): boolean{
    return (
        oldUser.birthDate       === newUser.birthDate       &&
        oldUser.capeName        === newUser.capeName        &&
        oldUser.email           === newUser.email           &&
        oldUser.endDate         === newUser.endDate         &&
        oldUser.firstName       === newUser.firstName       &&
        oldUser.groupName       === newUser.groupName       &&
        oldUser.lastName        === newUser.lastName        &&
        oldUser.middleName      === newUser.middleName      &&
        oldUser.phoneNumber     === newUser.phoneNumber     &&
        oldUser.profilePicture  === newUser.profilePicture  &&
        oldUser.rank            === newUser.rank            &&
        oldUser.startDate       === newUser.startDate       &&
        oldUser.status          === newUser.status
    )     
}