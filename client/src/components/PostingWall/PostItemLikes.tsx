import { Button, useMediaQuery } from "@mui/material"
import { isNullOrWhitespace } from 'common/utils'
import { useUserReference } from 'src/context/UserReference'
import { LikeListEmojiContent } from '../likes/LikeListButton'
import { useLikes } from '../likes/LikesContext'
import { UserLikesModal, useLikesModal } from '../likes/UserLikesModal'
import { PostItemLikesSkeleton } from './Skeleton'


export function PostItemLikes() {
    const { likes, isPending } = useLikes();
    const users = useUserReference();
    const isSmallScreen = useMediaQuery("(max-width: 675px)"); // We will consider this a small screen because the side drawer is docked at this width

    const { openModal } = useLikesModal();
    const onClick = () => {
        openModal();
    };

    if (isPending || users.isPending)
        return <PostItemLikesSkeleton />;

    if (users.isError)
        return <></>;

    if (likes.length <= 0)
        return <></>;



    const findActiveUser = (opts?: {offset?: number}): string | undefined => {
        const offset = opts?.offset ?? 0
        for (let i = offset; i < likes.length; i++) {
            const user = users.getUser(likes[i].userId)
            if (!user.isDeleted) {
                return user.shortFullName
            }
        }
        // Fall back to the first user if no active user is found
        return users.getUser(likes[0].userId).shortFullName
    }

    const name1 = findActiveUser();
    let text = "";

    if (likes.length === 1) {
        text = `${name1}`
    }

    if (likes.length === 2) {
        text = `${name1} og ${findActiveUser({offset: 1})}`;

        const maxLength = 40;
        if (text.length > maxLength && isSmallScreen) {
            text = `${name1} og 1 annen`;
        }
    }

    if (likes.length > 2) {
        text = `${name1} og ${likes.length - 1} andre`;
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
                    showCount={isNullOrWhitespace(text)} />
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
            <UserLikesModal />
        </>
    );
}