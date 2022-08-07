import { PageContainer } from "src/layout/PageContainer";

export function UserListPage () {
    return (
        <PageContainer>
            <h1>Medlemsliste</h1>
            <UserList/>
        </PageContainer>
    )
}

function UserList (){
    return (
        <h1>List</h1>
    )
}