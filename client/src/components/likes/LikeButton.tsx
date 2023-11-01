import { Button, ClickAwayListener, Paper, Popover, Popper } from "@mui/material";
import React, { useRef, useState } from "react";
import { useLikeEmoji } from "src/context/LikeEmoji";

export function LikeButton({
    style
}:{
    style?: React.CSSProperties
}) {

    const [isOpen, setIsOpen] = useState(false)
    const anchorEl = useRef(null)

    const onClick = () => {
        setIsOpen(true)
    }

    const onClickAway = () => {
        setIsOpen(false)
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
                        padding: "0px",
                        margin: "0px",
                        ...style
                    }}
                    sx={{
                        bgcolor: "transparent",
                        "&:hover": {
                            bgcolor: "transparent",
                        },
                        color: (theme) => theme.palette.text.primary,
                    }}
                >
                    Lik
                </Button>
                    <Popper 
                        open={isOpen}
                        anchorEl={anchorEl.current}
                        placement="bottom-start"
                        >
                        <LikeForm/>
                    </Popper>
            </span>
        </ClickAwayListener>
    )
}

function LikeForm() {
    const { likeEmoji } = useLikeEmoji()

    return (
        <Paper
            style={{
                borderRadius: "30px",
            }}
            elevation={8}
        >
            {Object.values(likeEmoji).map((emoji, index) => (
                <Button
                    key={emoji}
                    color="secondary"
                    style={{
                        margin: "0px",
                        padding: "0px",
                        paddingInline: "10px",
                        minWidth: "min-content",
                        fontSize: "18pt",
                        borderRadius: "30px",
                    }}
                >
                    {emoji}
                </Button>
            ))}
        </Paper>
    )
}