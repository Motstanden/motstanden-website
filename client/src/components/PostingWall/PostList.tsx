import { QueryKey } from "@tanstack/react-query";
import { LikeEntityType } from "common/enums";
import { WallPost } from "common/interfaces";
import { LikesContextProvider } from '../likes/LikesContext';
import { PostItem } from './PostItem';

export function PostList({ posts, queryKey }: { posts: WallPost[]; queryKey: QueryKey; }) {
    return (
        <>
            {posts.map((post) => (
                <LikesContextProvider
                    key={post.id}
                    entityType={LikeEntityType.WallPost}
                    entityId={post.id}
                >
                    <PostItem
                        post={post}
                        queryKey={queryKey}
                        style={{
                            marginBottom: "20px"
                        }} />
                </LikesContextProvider>
            ))}
        </>
    );
}
