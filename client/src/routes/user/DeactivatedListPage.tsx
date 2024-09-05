import { useAppBarHeader } from "src/context/AppBarHeader"
import { useTitle } from "src/hooks/useTitle"

export function DeactivatedUserListPage() {
    useTitle("Deaktiverte brukere")
    useAppBarHeader("Deaktiverte brukere")

    return (
        <>
            #todo
        </>
    )
}