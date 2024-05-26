import { useAppBarHeader } from "src/context/AppBarHeader";
import { PageContainer } from "src/layout/PageContainer/PageContainer";

export default function SuperAdminPage() {
    useAppBarHeader("Superadmin")
    return (
        <PageContainer>
            <h1>Superadmin</h1>
            <p>Du har nå kommet til superadmin-siden.</p>
            <p>Her kan du i fremtiden justere på superadmin-innstillinger</p>
        </PageContainer>
    )
}