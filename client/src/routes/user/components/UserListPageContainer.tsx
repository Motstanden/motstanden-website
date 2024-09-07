import { Outlet } from "react-router-dom"
import { useAppBarHeader } from "src/context/AppBarHeader"
import { usePotentialUser } from "src/context/Authentication"
import { PageContainer } from "src/layout/PageContainer/PageContainer"
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer"

export function UserListPageContainer() {
    useAppBarHeader("Brukere")
    const {isSuperAdmin} = usePotentialUser()
    
    if (isSuperAdmin) {
        return (
            <TabbedPageContainer
                tabItems={[
                    { to: "/brukere", label: "alle" },
                    { to: "/brukere/ny", label: "ny bruker" },
                ]}        
            >
                <Outlet/>
            </TabbedPageContainer>
        )
    }

    return (
        <PageContainer>
            <Outlet/>
        </PageContainer>
    )
}