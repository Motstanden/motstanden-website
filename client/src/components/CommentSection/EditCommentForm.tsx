import { TextField } from "@mui/material";
import { CommentEntityType } from "common/enums";
import { Comment } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import { useAuthenticatedUser } from "src/context/Authentication";
import { useSessionStorage } from "src/hooks/useStorage";
import SubmitFormButtons from "../form/SubmitButtons";

export function EditCommentForm({
    initialValue,
    entityType,
    onAbortClick,
    onSubmit,
    style
}: {
    initialValue: Comment,
    entityType: CommentEntityType,
    onAbortClick?: () => void,
    onSubmit?: (comment: Comment) => void,
    style?: React.CSSProperties
}) {
    const { user } = useAuthenticatedUser();

    const [value, setValue, clearValue] = useSessionStorage<Comment>({ 
        key: [ `${entityType}`, "comment", "edit", `${initialValue.id}`, `${user.id}`], 
        initialValue: initialValue
    })

    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault()
        const newValue: Comment = { 
            ...value,
            comment: value.comment.trim()
        }
        onSubmit?.(newValue)
        clearValue()
    }

    const handleAbortClick = () => {
        clearValue()
        onAbortClick?.()
    }

    const disabled = isNullOrWhitespace(value.comment) || value.comment.trim() === initialValue.comment.trim()

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                ...style
            }}
        >
            <TextField 
                type="text"
                label="Rediger kommentar..."
                required
                fullWidth
                multiline
                autoComplete="off"
                minRows={1}
                value={value.comment}
                onChange={(e) => setValue({ ...value, comment: e.target.value })}
            />
            <SubmitFormButtons
                loading={false}
                onAbort={handleAbortClick}
                disabled={disabled}
            />
        </form>
    )
}