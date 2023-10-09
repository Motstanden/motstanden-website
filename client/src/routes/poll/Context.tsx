import { Outlet } from "react-router-dom";
import { PageContainer } from "src/layout/PageContainer";


export function PollContext() {
    return (
        <PageContainer>
            <Outlet />
        </PageContainer>
    )
}