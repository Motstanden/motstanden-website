import { Button, Divider } from "@mui/material";
import { UserGroup } from "common/enums";
import { User } from "common/interfaces";
import { hasGroupAccess } from "common/utils";
import { useState } from "react";
import { Navigate, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useAuth } from "src/context/Authentication";
import { PageContainer } from "src/layout/PageContainer";
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack } from "@mui/system";

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

function EditForm( {user, newUser, children}: { user: User, newUser: User, children: React.ReactNode }) {
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
        <form onSubmit={onSubmit}>
            <h1>Rediger</h1>
            {children}
            <br/>
            <br/>
            <SubmitFormButtons loading={isSubmitting} onAbort={onAbort} canSubmit={!isUserEqual(user, newUser)}/>
            <Divider sx={{my: 3}}/>
        </form>
    )
}

function SelfEditPage({user}: {user: User}){

    // Can edit all BUT:
    //  - Role
    //  - Rank
    //  - Set themselves as Inactive
    // If admin, they can edit admin stuff too
    const [newUser, setNewUser] = useState<User>(user)
    return (
        <EditForm user={user} newUser={newUser}>            
            Selv redigering
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

function SubmitFormButtons( { 
    loading, 
    onAbort, 
    canSubmit
}: { 
    loading?: boolean, 
    canSubmit?: boolean,
    onAbort: React.MouseEventHandler<HTMLButtonElement> | undefined
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
                disabled={!canSubmit}
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
        oldUser.birthDate       === newUser.birthDate       ||
        oldUser.capeName        === newUser.capeName        ||
        oldUser.email           === newUser.email           ||
        oldUser.endDate         === newUser.endDate         ||
        oldUser.firstName       === newUser.firstName       ||
        oldUser.groupName       === newUser.groupName       ||
        oldUser.lastName        === newUser.lastName        ||
        oldUser.middleName      === newUser.middleName      ||
        oldUser.phoneNumber     === newUser.phoneNumber     ||
        oldUser.profilePicture  === newUser.profilePicture  ||
        oldUser.rank            === newUser.rank            ||
        oldUser.startDate       === newUser.startDate       ||
        oldUser.status          === newUser.status
    )     
}