import { Outlet } from "react-router-dom";
import { TabbedPageContainer } from "src/layout/PageContainer";

export default function PageContainer({ children }: { children?: React.ReactNode }) { 
    return (
        <TabbedPageContainer
            tabItems={[
                { to: "", label: "Hjem" },
                { to: "/vegg", label: "Vegg"}
            ]}
            matchChildPath={true}
        >
            <Outlet/>
        </TabbedPageContainer>
    )
}