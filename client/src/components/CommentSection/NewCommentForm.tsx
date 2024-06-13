import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from "@mui/lab";
import { Stack, TextField, Theme, useMediaQuery } from "@mui/material";
import { CommentEntityType } from "common/enums";
import { NewComment } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import { useState } from "react";
import { useAuthenticatedUser } from "src/context/Authentication";
import { StorageKeyArray, useSessionStorage } from 'src/hooks/useStorage';
import { postJson } from "src/utils/postJson";
import { UserAvatar } from '../user/UserAvatar';
import { CommentSectionVariant } from './CommentSection';

export function NewCommentForm({
    entityType, 
    entityId, 
    storageKey, 
    onPostSuccess, 
    variant,
}: {
    entityType: CommentEntityType;
    entityId: number;
    storageKey: StorageKeyArray;
    onPostSuccess?: ((res: Response) => Promise<void>) | ((res: Response) => void);
    variant?: CommentSectionVariant;
}) {
    const { user } = useAuthenticatedUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [value, setValue, clearValue] = useSessionStorage<NewComment>({
        key: storageKey,
        initialValue: { comment: "" },
    });

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newValue: NewComment = {
            comment: value.comment.trim()
        };

        const response = await postJson(`/api/${entityType}/${entityId}/comments/new`, newValue, { alertOnFailure: true });

        if (response && response.ok) {
            onPostSuccess && await onPostSuccess(response);
            setValue({ comment: "" });
        }

        clearValue();
        setIsSubmitting(false);
    };

    const disabled = isNullOrWhitespace(value.comment);

    return (
        <form onSubmit={onSubmit}>
            <Stack
                direction="row"
            >
                <UserAvatar
                    userId={user.id}
                    style={{
                        display: isSmallScreen ? "none" : "inherit",
                        marginRight: variant === "normal" ? "17px" : "11px"
                    }} />
                <div
                    style={{
                        width: "100%"
                    }}>
                    <TextField
                        type="text"
                        label="Skriv en kommentar..."
                        required
                        fullWidth
                        multiline
                        autoComplete="off"
                        value={value.comment}
                        onChange={(e) => setValue({ comment: e.target.value })}
                        disabled={isSubmitting}
                        minRows={variant === "normal" ? 2 : 1}
                        sx={{ mb: variant === "normal" ? 4 : 2 }}
                        style={{
                            marginTop: variant === "normal" ? "0px" : "-6px"
                        }} />
                    <LoadingButton
                        type="submit"
                        loading={isSubmitting}
                        variant="contained"
                        loadingPosition="end"
                        endIcon={<SendIcon />}
                        disabled={disabled}
                        style={{
                            minWidth: "120px"
                        }}
                        size={variant === "normal" ? "medium" : "small"}
                    >
                        Kommenter
                    </LoadingButton>
                </div>
            </Stack>
        </form>
    );
}
