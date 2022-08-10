import { User } from "common/interfaces";
import { getFullName } from "common/utils";
import { Navigate, useOutletContext, useParams } from "react-router-dom";
import { PageContainer } from "src/layout/PageContainer";

export function UserPage() {
    const users = useOutletContext<User[]>()

    const params = useParams();
    const userId = strToNumber(params.userId)
    if(!userId){
        return <Navigate to="/medlem/liste"/>
    }
    
    const user = users.find( item => item.userId === userId)

    if(!user) {
        return <Navigate to="/medlem/liste"/>
    }

    return(
        <>
            <h1>{getFullName(user)}</h1>
            <p>#TODO</p> 
        </>
    )
}

function strToNumber(str: string | undefined): number | undefined {
    if(!str)
        return undefined

    if(!onlyNumbers(str))
        return undefined

    return parseInt(str)
}

function onlyNumbers(str: string): boolean {
    return /^[0-9]+$/.test(str);
}