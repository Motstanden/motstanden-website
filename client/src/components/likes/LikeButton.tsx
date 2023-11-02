import { Button, ClickAwayListener, Paper, ButtonProps, Popper } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { LikeEmoji, NewLike } from "common/interfaces";
import React, { useRef, useState } from "react";
import { useLikeEmoji } from "src/context/LikeEmoji";
import { postJson } from "src/utils/postJson";
import { useLikes } from "./LikesContext";

interface LikeButtonProps extends Omit<ButtonProps, "style" | "onClick" | "ref"> {
    style?: React.CSSProperties
    isLikedStyle?: React.CSSProperties
}

export function LikeButton(props: LikeButtonProps) {

    const { style, isLikedStyle, sx, ...remainingProps } = props

    const { selfLike } = useLikes()
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

        const isDelete = selfLike?.emojiId === id

        const value: NewLike | Record<never, never> = isDelete 
            ? {} 
            : { emojiId: id }

        const url = isDelete 
            ? `/api/${entityType}/${entityId}/likes/delete`
            : `/api/${entityType}/${entityId}/likes/upsert`

        const response = await postJson(url, value, { alertOnFailure: true })

        if(response?.ok){
            await queryClient.invalidateQueries(queryKey)
        }
        onPostSuccess?.()
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