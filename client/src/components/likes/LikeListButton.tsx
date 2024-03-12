import { ButtonProps, IconButton, Skeleton, useTheme } from "@mui/material"
import { useLikeEmoji } from "src/context/LikeEmoji"
import { useLikes } from "./LikesContext"
import { UserLikesModal, useLikesModal } from "./UserLikesModal"

interface LikeListButtonProps extends Omit<ButtonProps, "onClick"> {
    maxItems?: number
}

export function LikeListIconButton( props: LikeListButtonProps) {
    const { maxItems, style, ...remainingProps } = props

    const { likes, isPending, isError } = useLikes()
    const theme = useTheme()
    
    const { openModal } = useLikesModal()
    const onEmojiClick = () => {
        openModal()
    }
    
    if(isPending) 
        return <LikeListIconButtonSkeleton style={style}/>

    if(isError || likes.length === 0)
        return <></>

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
                <LikeListEmojiContent maxItems={maxItems} showCount/>
            </IconButton>
            <UserLikesModal/>
        </>
    )
}

export function LikeListEmojiContent( { 
    maxItems, 
    showCount,
    style
}: {
    maxItems?: number, 
    showCount?: boolean,
    style?: React.CSSProperties
}) {
    const { likes, groupedLikes } = useLikes()
    const { emojis } = useLikeEmoji()

    const filteredLikes = maxItems 
        ? groupedLikes.filter( (_, index) => index < maxItems )
        : groupedLikes 

    return (
        <span style={{
                whiteSpace: "nowrap",
                ...style
            }}
        >
            {filteredLikes.map( item => (
                <span key={item.emojiId}>
                    {emojis[item.emojiId].text}
                </span>
            ))}
            {showCount && likes.length > 1 && (
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
        </span>
    )
}

function LikeListIconButtonSkeleton( {style}: {style?: React.CSSProperties}) {
    return (
        <Skeleton 
            variant='rectangular'
            height={21}
            width={70}
            style={{
                padding: 0,
                margin: 0,
                ...style
            }}
        />
    )
}