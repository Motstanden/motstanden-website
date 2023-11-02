import { Button, ClickAwayListener, Paper, Popover, Popper } from "@mui/material";
import React, { useRef, useState } from "react";
import { useLikeEmoji } from "src/context/LikeEmoji";
import { useLikes } from "./LikesContext";
import { NewLike } from "common/interfaces";
import { postJson } from "src/utils/postJson";
import { useQueryClient } from "@tanstack/react-query";

export function LikeButton({
    style,
    isLikedStyle,
}:{
    style?: React.CSSProperties
    isLikedStyle?: React.CSSProperties
}) {

    const { selfLike } = useLikes()
    const { likeEmoji } = useLikeEmoji()

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

    const addedStyle = selfLike ? isLikedStyle : {}
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
                        ...style,
                        ...addedStyle
                    }}
                    sx={{
                        bgcolor: "transparent",
                        "&:hover": {
                            bgcolor: "transparent",
                        },
                        color: (theme) => theme.palette.text.primary,
                    }}
                >
                    {selfLike ? likeEmoji[selfLike.emojiId] + "likt" : "lik"}
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
    const { likeEmoji } = useLikeEmoji()
    const [isDisabled, setIsDisabled] = useState(false)
    
    const queryClient = useQueryClient()

    const {entityType, entityId, queryKey} = useLikes()

    const onClick = async (id: number) => {
        setIsDisabled(true)

        const value: NewLike = { emojiId: id }
        const url = `/api/${entityType}/${entityId}/likes/upsert`

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
            {Object.keys(likeEmoji).map( idStr => (
                <Button
                    key={idStr}
                    color="secondary"
                    onClick={() => onClick(Number(idStr))}
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
                    {likeEmoji[Number(idStr)]}
                </Button>
            ))}
        </Paper>
    )
}