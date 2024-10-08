import { Button, ButtonProps, ClickAwayListener, Paper, Popper, Skeleton } from "@mui/material"
import { useQueryClient } from "@tanstack/react-query"
import { LikeEmoji, NewLike } from "common/interfaces"
import React, { useRef, useState } from "react"
import { useLikeEmoji } from "src/context/LikeEmoji"
import { httpSendJson, postJson } from "src/utils/postJson"
import { useLikes } from "./LikesContext"

interface LikeButtonProps extends Omit<ButtonProps, "style" | "onClick" | "ref"> {
    style?: React.CSSProperties
    isLikedStyle?: React.CSSProperties
}

export function LikeButton(props: LikeButtonProps) {

    const { style, isLikedStyle, sx, ...remainingProps } = props

    const { selfLike, isPending } = useLikes()
    const { emojis } = useLikeEmoji()
    const usedEmoji: LikeEmoji | undefined = selfLike ? emojis[selfLike.emojiId] : undefined

    const [isOpen, setIsOpen] = useState(false)
    const anchorEl = useRef(null)

    const onClick = () => {
        setIsOpen(true)
    }

    const onClickAway = () => {
        setIsOpen(false)
    }

    const onPostSuccess = () => { 
        setIsOpen(false)
    }

    if(isPending)
        return <LikeButtonSkeleton style={style}/>

    let addedStyle = {}
    if(selfLike) {
       addedStyle = {
           opacity: 1,
           ...style,
            ...isLikedStyle
       } 
    } else {
        addedStyle = {
            opacity: 0.6,
            ...style
        }
    }

    return (
        <ClickAwayListener onClickAway={onClickAway}>
            <span>
                <Button
                    ref={anchorEl}
                    color="secondary"
                    variant="text"
                    onClick={onClick}
                    style={{
                        padding: "0px 2px",
                        margin: "0px",
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        ...addedStyle
                    }}
                    sx={{
                        color: (theme) => theme.palette.text.primary,
                        ...sx
                    }}
                    {...remainingProps}
                >
                    {usedEmoji ? usedEmoji.text + usedEmoji.description : "lik"}
                </Button>
                    <Popper 
                        open={isOpen}
                        anchorEl={anchorEl.current}
                        placement="bottom-start"
                        >
                        <LikeForm onPostSuccess={onPostSuccess}/>
                    </Popper>
            </span>
        </ClickAwayListener>
    )
}

export function LikeButtonSkeleton( { style }: {style?: React.CSSProperties}) {
    return (
        <Skeleton
            variant="text" 
            width={60}
            style={{
                display: "inline-block",
                ...style
            }}
        />
    )
}

function LikeForm( {
    onPostSuccess
}: {
    onPostSuccess?: () => void
}) {
    const { selfLike } = useLikes()
    const { emojis } = useLikeEmoji()
    const [isDisabled, setIsDisabled] = useState(false)
    
    const queryClient = useQueryClient()

    const {entityType, entityId, queryKey} = useLikes()

    const onClick = async (id: number) => {
        setIsDisabled(true)

        const isDeleteAction = selfLike?.emojiId === id

        const value: NewLike | Record<never, never> = isDeleteAction  ? {} : { emojiId: id }
        const url = `/api/${entityType}/${entityId}/likes/me`
        const httpVerb = isDeleteAction ? "DELETE" : "PUT"
        
        const response = await httpSendJson(httpVerb, url, value, { alertOnFailure: true })

        if(response?.ok){
            queryClient.invalidateQueries({queryKey: queryKey})
            onPostSuccess?.()
        }
        setIsDisabled(false)
    }

    return (
        <Paper
            style={{
                borderRadius: "30px",
            }}
            elevation={8}
        >
            {Object.values(emojis).map( emoji => (
                <Button
                    key={emoji.id}
                    color="secondary"
                    variant={selfLike?.emojiId === emoji.id ? "outlined" : "text"}
                    onClick={() => onClick(emoji.id)}
                    disabled={isDisabled}
                    style={{
                        margin: "0px",
                        padding: "0px",
                        paddingInline: "10px",
                        minWidth: "min-content",
                        fontSize: "18pt",
                        borderRadius: "30px",
                    }}
                >
                    {emoji.text}
                </Button>
            ))}
        </Paper>
    )
}