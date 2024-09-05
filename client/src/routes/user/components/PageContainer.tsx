import { Outlet } from "react-router-dom"
import { PageContainer } from "src/layout/PageContainer/PageContainer"

export function UserPageContainer() {
    return (
        <PageContainer>
            <Outlet />
        </PageContainer>
    )
}
