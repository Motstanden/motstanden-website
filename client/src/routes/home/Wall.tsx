import { PostingWall } from "src/components/wall/PostingWall"
import { useTitle } from "src/hooks/useTitle"
import { useUnreadWallPosts } from "./context/UnreadWallPosts"

export default function WallPage() {
    useTitle("Vegg")

    const { clearUnreadPosts } = useUnreadWallPosts()

    const onPostSuccess = () => {
        clearUnreadPosts({refetchData: true})
    }

    const onLoadedPosts = () => {
        clearUnreadPosts({refetchData: false})
    }

    return (
        <>
            <h1>Vegg</h1>
            <PostingWall onPostSuccess={onPostSuccess} onLoadedPosts={onLoadedPosts}/>
        </>
    )
} 