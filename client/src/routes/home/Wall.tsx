import { PostingWall } from "src/components/PostingWall"
import { useTitle } from "src/hooks/useTitle"

export default function WallPage() {
    useTitle("Vegg")
    return (
        <PostingWall/>
    )
} 