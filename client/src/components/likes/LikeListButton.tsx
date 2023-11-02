import { ButtonProps, IconButton, Skeleton, useTheme } from "@mui/material"
import { useLikes } from "./LikesContext"
import { useLikeEmoji } from "src/context/LikeEmoji"
import { UserLikesModal, useLikesModal } from "./UserLikesModal"

interface LikeListButtonProps extends Omit<ButtonProps, "onClick"> {
    maxItems?: number
}

export function LikeListIconButton( props: LikeListButtonProps) {
    const { maxItems, style, ...remainingProps } = props

    const { likes, groupedLikes, isLoading, isError } = useLikes()
    const { emojis } = useLikeEmoji()
    const theme = useTheme()
    
    const { openModal } = useLikesModal()
    const onEmojiClick = () => {
        openModal()
    }
    
    if(isLoading) 
        return <LikeListIconButtonSkeleton/>

    if(isError || likes.length === 0)
        return <></>

    const filteredLikes = maxItems 
        ? groupedLikes.filter( (_, index) => index < maxItems )
        : groupedLikes 

    return (
        <>
            <IconButton 
                {...remainingProps}
                onClick={onEmojiClick}
                style={{
                    margin: "0px",
                    padding: "0px",
                    color: theme.palette.text.primary,
                    ...style
                }}
            >
                {filteredLikes.map( item => (
                    <span key={item.emojiId}>
                        {emojis[item.emojiId].text}
                    </span>
                ))}
                {likes.length > 1 && (
                    <span 
                        style={{
                            marginLeft: "2px",
                            marginRight: "2px",
                            fontSize: "small"
                        }}
                    >
                        {likes.length + 1 >= 100 ? "99+" : likes.length}
                    </span>
                )}
            </IconButton>
            <UserLikesModal/>
        </>
    )
}

function LikeListIconButtonSkeleton() {
    // TODO: Implement
    return (
        <Skeleton 
            variant='circular'
            height={20}
            width={20}
        />
    )
}