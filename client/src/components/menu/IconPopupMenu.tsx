import { ClickAwayListener, IconButton, Menu } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

export type IconSize = "small" | "medium" | "large"

export function IconPopupMenu({
    children,
    icon,
    disabled,
    onMouseEnter,
    onMouseLeave,
    onMenuOpen,
    onMenuClose,
    ariaLabel,
    style,
    size
}: {
    children: React.ReactNode,
    icon: React.ReactNode,
    disabled?: boolean,
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>,
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>,
    onMenuOpen?: VoidFunction,
    onMenuClose?: VoidFunction,
    ariaLabel?: string
    style?: React.CSSProperties,
    size?: IconSize
}) {
    const [isOpen, setIsOpen] = useState(false)
    const anchorEl = useRef(null)
    useEffect(() => {
        if (anchorEl && isOpen) {
            onMenuOpen && onMenuOpen()
        }
        if (anchorEl && !isOpen) {
            onMenuClose && onMenuClose()
        }
    }, [isOpen])

    return (
        <>
            <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                <IconButton
                    ref={anchorEl}
                    onClick={() => setIsOpen(prevValue => !prevValue)}
                    disabled={disabled}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    aria-label={ariaLabel}
                    style={style}
                    size={size}
                >
                    {icon}
                </IconButton>
            </ClickAwayListener>
            <Menu
                style={{ margin: 0, padding: 0 }}
                anchorEl={anchorEl.current}
                open={!disabled && isOpen}
                onClose={() => setIsOpen(false)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {children}
            </Menu>
        </>
    )
}