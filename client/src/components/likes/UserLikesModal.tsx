import CloseIcon from '@mui/icons-material/Close';
import { Badge, Dialog, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material";
import { useLikeEmoji } from "src/context/LikeEmoji";
import { UserAvatar } from "../user/UserAvatar";
import { UserFullName } from "../user/UserFullName";
import { useLikes } from "./LikesContext";

export function UserLikesModal({
    open,
    onClose
}: {
    open: boolean
    onClose?: () => void
}){
    const likes = useLikes()
    const emojis = useLikeEmoji()

    return (
        <Dialog
            open={open}
            onClose={onClose}
            scroll="paper"
            fullWidth
        >
            <DialogTitle>
                <Stack 
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center"
                    spacing={1}
                    >
                    <div>
                        Likes
                    </div>
                    <IconButton
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent >
                {likes.likes.map(like => (
                    <Stack
                        key={like.userId} 
                        direction="row" 
                        alignItems="center"
                        spacing={1.5}
                        sx={{mb: 2}}
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