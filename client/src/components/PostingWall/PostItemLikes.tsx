import { Button, useMediaQuery } from "@mui/material";
import { isNullOrWhitespace } from 'common/utils';
import { useUserReference } from 'src/context/UserReference';
import { LikeListEmojiContent } from '../likes/LikeListButton';
import { useLikes } from '../likes/LikesContext';
import { UserLikesModal, useLikesModal } from '../likes/UserLikesModal';
import { PostItemLikesSkeleton } from './Skeleton';


export function PostItemLikes() {
    const { likes, isPending } = useLikes();
    const { userReference } = useUserReference();
    const isSmallScreen = useMediaQuery("(max-width: 675px)"); // We will consider this a small screen because the side drawer is docked at this width

    const { openModal } = useLikesModal();
    const onClick = () => {
        openModal();
    };

    if (isPending)
        return <PostItemLikesSkeleton />;

    if (likes.length <= 0)
        return <></>;

    let text = "";
    if (userReference) {

        const name = userReference[likes[0].userId].shortFullName;

        if (likes.length === 1)
            text = `${name}`;

        if (likes.length === 2) {
            text = `${name} og ${userReference[likes[1].userId].shortFullName}`;

            const maxLength = 40;
            if (text.length > maxLength && isSmallScreen) {
                text = `${name} og 1 annen`;
            }
        }

        if (likes.length > 2) {
            text = `${name} og ${likes.length - 1} andre`;
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
