import CloseIcon from '@mui/icons-material/Close';
import { Badge, Dialog, DialogContent, DialogTitle, IconButton, Stack, Tab, Tabs, Theme, useMediaQuery } from "@mui/material";
import { Like } from 'common/interfaces';
import { useState } from 'react';
import { useLikeEmoji } from "src/context/LikeEmoji";
import { UserAvatar } from "../user/UserAvatar";
import { UserFullName } from "../user/UserFullName";
import { useLikes } from "./LikesContext";


type Size = "small" | "normal" 

export function UserLikesModal({
    open,
    onClose
}: {
    open: boolean
    onClose?: () => void
}){
    const { likes } = useLikes()

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const [selectedEmojiId, setSelectedEmojiId] = useState(-1)

    const onTabSelectionChanged = (emojiId: number) => setSelectedEmojiId(emojiId)

    let filteredLikes = likes;
    if(selectedEmojiId !== -1){ 
        filteredLikes = likes.filter(like => like.emojiId === selectedEmojiId)
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            scroll="paper"
            fullWidth
            fullScreen={isSmallScreen}
        >
            <DialogTitle >
                <Stack 
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center"
                    >
                    <EmojiTabs 
                        selectedEmojiId={selectedEmojiId}
                        onSelectedChanged={onTabSelectionChanged}
                        tabItemStyle={{
                            marginBottom: isSmallScreen ? "10px" : undefined,
                        }}
                        tabIndicatorStyle={{
                            bottom: isSmallScreen ? "10px" : undefined,
                        }}
                        size={isSmallScreen ? "small" : "normal"}
                    />
                    <IconButton 
                        onClick={onClose}
                        style={{
                            marginBottom: isSmallScreen ? "10px" : undefined
                        }}
                        >
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent
                sx={{
                    height: isSmallScreen ? undefined : "70vh"
                }}
            >
                <UserList items={filteredLikes}/>
            </DialogContent>
        </Dialog>
    )
}

interface EmojiTab {
    emojiId: number,
    count: number
}

function EmojiTabs( { 
    selectedEmojiId,
    onSelectedChanged,
    tabItemStyle,
    tabIndicatorStyle,
    size = "normal"
}: { 
    selectedEmojiId: number,
    onSelectedChanged: (newIndex: number) => void,
    tabItemStyle?: React.CSSProperties,
    tabIndicatorStyle?: React.CSSProperties,
    size?: Size
}) {

    const { likes } = useLikes()
    const { likeEmoji  } = useLikeEmoji()

    const tabData: EmojiTab[] = []
    for(const emoji in likeEmoji){
        if(likes.some(like => like.emojiId === Number(emoji))){
            tabData.push({
                emojiId: Number(emoji),
                count: likes.filter(like => like.emojiId === Number(emoji)).length
            })
        }
    }
    tabData.sort((a, b) => b.count - a.count)

    const tabStyle: React.CSSProperties = {
        minWidth: "min-content",
        padding: "0px 10px",
        ...tabItemStyle
    }

    return (
        <Tabs
            textColor='secondary'
            indicatorColor='secondary'
            value={selectedEmojiId}
            variant={size === "small" ? "scrollable" : "standard"}
            visibleScrollbar
            TabIndicatorProps={{
                style: tabIndicatorStyle
            }}
        >
            <Tab 
                label="Alle"
                value={-1}
                onClick={() => onSelectedChanged(-1)}
                style={tabStyle}
            />
            {tabData.map(item => (
                <Tab 
                    key={item.emojiId}
                    label={(
                        <TabEmojiLabel
                            emoji={likeEmoji[item.emojiId]}
                            count={item.count}
                            size={size}
                        />
                    )}
                    value={item.emojiId}
                    style={tabStyle}
                    onClick={() => onSelectedChanged(item.emojiId)}
                />
            ))} 
        </Tabs>
    )
}

function TabEmojiLabel({ 
    emoji, 
    count,
    size
}: {
    emoji: string, 
    count: number
    size: Size
}) {
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
            }}
        >
            <span 
                style={{
                    fontSize: size === "small" ? "14pt" : "18pt"
                }}
            >
                {emoji}
            </span>
            <span>
                {count}
            </span>
        </div>
    )
}

function UserList( {items}: {items: Like[]}) {

    const { likeEmoji  } = useLikeEmoji()

    return (
        <>
            {items.map(like => (
                <Stack
                    key={like.userId} 
                    direction="row" 
                    alignItems="center"
                    spacing={1.5}
                    sx={{
                        mb: 2,
                    }}
                    >
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={(<EmojiBadge emoji={likeEmoji[like.emojiId]} />)}
                    >
                        <UserAvatar userId={like.userId} />
                    </Badge>
                    <UserFullName userId={like.userId} />
                </Stack>
            ))}
        </>
    )
}

function EmojiBadge( { emoji }: { emoji: string} ) {
    return (
        <span 
            style={{
                fontSize: "1.4em"
            }}
        >
            {emoji}
        </span>
    )    
}
