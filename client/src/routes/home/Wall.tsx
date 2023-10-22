import { useTitle } from "src/hooks/useTitle"

export default function WallPage() {
    useTitle("Vegg")
    return (
        <>
            <h1>Vegg</h1>
            <p>Her kan du snart skrive på veggen...</p>
        </>
    )
} 