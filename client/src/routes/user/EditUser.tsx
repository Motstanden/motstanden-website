import { UserGroup } from "common/enums";
import { User } from "common/interfaces";
import { hasGroupAccess } from "common/utils";
import { Navigate, useOutletContext, useParams } from "react-router-dom";
import { useAuth } from "src/context/Authentication";
import { PageContainer } from "src/layout/PageContainer";

export function EditUserPage () {
    
    const currentUser = useAuth().user!
    const viewedUser = useOutletContext<User>()
    
    if(hasGroupAccess(currentUser, UserGroup.SuperAdministrator)) {
        return <SuperAdminEdit/>
    }

    if(currentUser.userId === viewedUser.userId) {
        return <SelfEditPage/>
    }

    if(hasGroupAccess(currentUser, UserGroup.Administrator)) {
        return <AdminEdit/>
    }

    return <Navigate to={`/medlem/${viewedUser.userId}`}/>
}

function SelfEditPage() {
    return (
        <>
            Selv redigering
        </>
    )
}

function AdminEdit() {
    return (
        <>
            Admin redigering
        </>
    )
} 

function SuperAdminEdit() {
    return (
        <>
            Super admin redigering
        </>
    )
}