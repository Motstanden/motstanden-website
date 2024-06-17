import { Button, Skeleton, useMediaQuery } from "@mui/material";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { WallPost } from "common/interfaces";
import { isNullOrWhitespace } from 'common/utils';
import { useAuthenticatedUser } from "src/context/Authentication";
import { useUserReference } from 'src/context/UserReference';
import { useQuerySuccess } from 'src/hooks/useQuerySuccess';
import { StorageKeyArray } from 'src/hooks/useStorage';
import { fetchFn } from "src/utils/fetchAsync";
import { LikeListEmojiContent } from '../likes/LikeListButton';
import { useLikes } from '../likes/LikesContext';
import { UserLikesModal, useLikesModal } from '../likes/UserLikesModal';
import { NewPostForm } from './NewPostForm';
import { PostList } from './PostList';
import { PostListSkeleton } from './Skeleton';

export function PostingWall({
    userId,
    style,
    userFirstName,
    onPostSuccess,
    onLoadedPosts
}: {
    userId?: number,
    userFirstName?: string,
    style?: React.CSSProperties
    onPostSuccess?: (() => Promise<void>) | (() => void),
    onLoadedPosts?: () => void
}) {
    const { user: currentUser } = useAuthenticatedUser()

    const queryClient = useQueryClient()

    const queryKey: StorageKeyArray = ["wall-post", userId ?? "all"]

    const handlePostSuccess = async () => {
        await queryClient.invalidateQueries({queryKey: queryKey})
        await onPostSuccess?.()
    }

    return (
        <section
            style={{
                maxWidth: "650px",
                ...style
            }}
        >
            <NewPostForm
                onPostSuccess={handlePostSuccess}
                storageKey={queryKey}
                initialValue={{
                    content: "",
                    wallUserId: userId ?? currentUser.id,
                }} 
                style={{
                    marginBottom: "20px"
                }} 
                userFirstName={userFirstName}
            />
            <PostSectionFetcher 
                queryKey={queryKey}
                userId={userId}
                onLoadedPosts={onLoadedPosts}
            />
        </section>
    )
}

function PostSectionFetcher({
    queryKey,
    userId,
    onLoadedPosts,
}: {
    queryKey: QueryKey
    userId?: number,
    onLoadedPosts?: () => void
}) {
    
    let url = "/api/wall-posts/all"
    if(userId)
        url += `?userId=${userId}`

    const { isPending, isError, data, error, isSuccess } = useQuery<WallPost[]>({
        queryKey: queryKey,
        queryFn: fetchFn<WallPost[]>(url), 
    })

    useQuerySuccess({isSuccess}, onLoadedPosts)

    if(isPending) {
        return <PostListSkeleton length={6} />
    }

    if(isError) {
        return <div>{`${error}`}</div>
    }

    return (
        <PostList posts={data} queryKey={queryKey}/>
    )
}

export function LikeList() {
    const { likes, isPending } = useLikes()
    const { userReference } = useUserReference()
    const isSmallScreen = useMediaQuery("(max-width: 675px)")       // We will consider this a small screen because the side drawer is docked at this width

    const { openModal } = useLikesModal()
    const onClick = () => { 
        openModal()
    }

    if(isPending) 
        return <LikeListSkeleton/>

    if(likes.length <= 0)
        return <></>
    
    let text = ""
    if(userReference) {

        const name = userReference[likes[0].userId].shortFullName

        if(likes.length === 1)
            text = `${name}` 

        if(likes.length === 2) {
            text = `${name} og ${userReference[likes[1].userId].shortFullName}` 

            const maxLength = 40
            if(text.length > maxLength && isSmallScreen) {
                text = `${name} og 1 annen`
            }
        }

        if(likes.length > 2) {
            text = `${name} og ${likes.length - 1} andre`
        }
    }

    return (
        <>
            <Button 
                color="secondary"
                variant="text"
                onClick={onClick}
                style={{
                    minWidth: "0px",
                    padding: "0px 5px",
                    textTransform: "none",
                    alignItems: "flex-start",
                    textAlign: "left",
                }}
                sx={{
                    color: (theme) => theme.palette.text.primary
                }}
            >
                    <LikeListEmojiContent 
                        maxItems={isSmallScreen && !isNullOrWhitespace(text) ? 2 : 3} 
                        showCount={isNullOrWhitespace(text)}
                        />
                    {text && (
                        <div style={{
                            fontWeight: "bold",
                            marginLeft: "3px",
                            opacity: 0.6,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}>
                            {text}
                        </div>
                    )}
            </Button>
            <UserLikesModal/> 
        </>
    )
}

export function LikeListSkeleton() {
    return ( 
        <Skeleton width={130} />
    )
}

