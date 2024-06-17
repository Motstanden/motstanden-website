import { TextField } from "@mui/material";
import { WallPost } from "common/interfaces";
import { isNullOrWhitespace } from 'common/utils';
import { useAuthenticatedUser } from "src/context/Authentication";
import { useSessionStorage } from 'src/hooks/useStorage';
import SubmitFormButtons from '../form/SubmitButtons';


export function EditPostForm({
    initialValue, 
    onAbortClick, 
    onSubmit,
}: {
    initialValue: WallPost;
    onAbortClick?: VoidFunction;
    onSubmit?: (editedPost: WallPost) => void;
}) {
    const { user } = useAuthenticatedUser();

    const [value, setValue, clearValue] = useSessionStorage<WallPost>({
        initialValue: initialValue,
        key: ["wall-post", "edit", `${initialValue.id}`, `${user.id}`]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newValue: WallPost = {
            ...value,
            content: value.content.trim()
        };
        onSubmit?.(newValue);
        clearValue();
    };

    const handleAbortClick = () => {
        clearValue();
        onAbortClick?.();
    };

    const disabled = isNullOrWhitespace(value.content) || value.content.trim() === initialValue.content.trim();

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                marginTop: "25px",
                marginBottom: "25px"
            }}
        >
            <TextField
                type="text"
                label="Rediger post..."
                required
                fullWidth
                multiline
                autoComplete="off"
                minRows={1}
                value={value.content}
                onChange={(e) => setValue(oldVal => ({ ...oldVal, content: e.target.value }))}
                sx={{
                    mb: 3
                }} />
            <SubmitFormButtons
                loading={false}
                onAbort={handleAbortClick}
                disabled={disabled} />
        </form>
    )
}
