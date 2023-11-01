import CloseIcon from '@mui/icons-material/Close';
import { Badge, Dialog, DialogContent, DialogTitle, IconButton, Stack, Tab, Tabs, Theme, useMediaQuery } from "@mui/material";
import { useState } from 'react';
import { useLikeEmoji } from "src/context/LikeEmoji";
import { UserAvatar } from "../user/UserAvatar";
import { UserFullName } from "../user/UserFullName";
import { useLikes } from "./LikesContext";
import { TabList } from '@mui/lab';

interface EmojiTab {
    emojiId: number,
    count: number
}

export function UserLikesModal({
    open,
    onClose
}: {
    open: boolean
    onClose?: () => void
}){
    const likes = useLikes()
    const emojis = useLikeEmoji()

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const [selectedEmoji, setSelectedEmoji] = useState(-1)

    const onTabClick = (emojiId: number) => setSelectedEmoji(emojiId)

    const uniqueEmojis: number[] = []
    for(const like of likes.likes){
        if(!uniqueEmojis.includes(like.emojiId)){
            uniqueEmojis.push(like.emojiId)
        }
    }

    const emojiTabs: EmojiTab[] = []

    for(const emojiId of uniqueEmojis){ 
        emojiTabs.push({
            emojiId: emojiId,
            count: likes.likes.filter(like => like.emojiId === emojiId).length
        })
    }

    let filteredLikes = likes.likes;
    if(selectedEmoji !== -1){ 
        filteredLikes = likes.likes.filter(like => like.emojiId === selectedEmoji)
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
                    <Tabs
                        textColor='secondary'
                        indicatorColor='secondary'
                        value={selectedEmoji}
                        variant={isSmallScreen ? "scrollable" : "standard"}
                        visibleScrollbar
                        TabIndicatorProps={{
                            style: {
                                bottom: isSmallScreen ? "10px" : undefined,
                            }
                        }}
                        
                    >
                        <Tab 
                            label="Alle"
                            value={-1}
                            onClick={() => onTabClick(-1)}
                            style={{
                                minWidth: "min-content",
                                padding: "0px 10px",
                                marginBottom: isSmallScreen ? "10px" : undefined
                            }}
                        />
                        {emojiTabs.map(item => (
                            <Tab 
                                key={item.emojiId}
                                label={(
                                    <div
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span 
                                            style={{
                                                fontSize: isSmallScreen ? "14pt" : "18pt"
                                            }}
                                        >
                                            {emojis.likeEmoji[item.emojiId]}
                                        </span>
                                        <span>
                                            {item.count}
                                        </span>
                                    </div>
                                )}
                                value={item.emojiId}
                                style={{
                                    minWidth: "min-content",
                                    margin: "0px",
                                    padding: "0px 10px",
                                    marginBottom: isSmallScreen ? "10px" : undefined
                                }}
                                onClick={() => onTabClick(item.emojiId)}
                            />
                        ))} 
                    </Tabs>
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
                {filteredLikes.map(like => (
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
                            badgeContent={
                                <span 
                                    style={{
                                        fontSize: "1.4em"
                                    }}
                                >
                                    {emojis.likeEmoji[like.emojiId]}
                                </span>
                            }
                        >
                            <UserAvatar userId={like.userId} />
                        </Badge>
                        <UserFullName userId={like.userId} />
                    </Stack>
                ))}
            </DialogContent>
        </Dialog>
    )
}