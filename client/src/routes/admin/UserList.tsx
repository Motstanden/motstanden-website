import { useQuery } from "@tanstack/react-query";
import { User } from "common/interfaces";
import { getFullName } from "common/utils";
import { PageContainer } from "src/layout/PageContainer";
import { fetchAsync } from "src/utils/fetchAsync";

export function UserListPage () {
    return (
        <PageContainer>
            <h1>Medlemsliste</h1>
            <UserList/>
        </PageContainer>
    )
}

function UserList (){
    const {isLoading, isError, data, error} = useQuery<User[]>(["FetchAllUsers"], () => fetchAsync<User[]>("/api/member-list") )
    
    if (isLoading) {
        return <PageContainer><div/></PageContainer>
    }
    
    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }

    return (
        <ul>
            {data.map( (user) => (<li>{getFullName(user)}</li>))}
        </ul>
    )
}