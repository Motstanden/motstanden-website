import { useAppBarHeader } from "src/context/AppBarHeader";
import { PageContainer } from "src/layout/PageContainer/PageContainer";

export default function AdminPage() {
    useAppBarHeader("Admin")
    return (
        <PageContainer>
            <h1>Admin</h1>
            <p>Du har nå kommet til admin siden.</p>
            <p>Her kan du i fremtiden justere på admin-innstillinger</p>
        </PageContainer>
    )
}