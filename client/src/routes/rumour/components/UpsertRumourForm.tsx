import { Box, TextField } from "@mui/material"
import { NewRumour, Rumour } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import { Form } from "src/components/form/Form"
import { StorageKeyArray, useSessionStorage } from "src/hooks/useStorage"


export function UpsertRumourForm({
    initialValue, 
    url, 
    httpMethod,
    storageKey,
    onAbortClick, 
    onPostSuccess,
}: {
    initialValue: NewRumour | Rumour;
    url: string;
    httpMethod: "POST" | "PATCH";
    storageKey: StorageKeyArray,
    onAbortClick: VoidFunction;
    onPostSuccess: VoidFunction;
}) {
    const [newValue, setNewValue, clearNewValue] = useSessionStorage<NewRumour | Rumour>({
        key: storageKey,
        initialValue: initialValue
    });

    const validateData = () => {
        const isEmpty = isNullOrWhitespace(newValue.rumour);
        const isEqual = newValue.rumour.trim() === initialValue.rumour.trim();
        return !isEmpty && !isEqual;
    };

    const getSubmitData = () => {
        return { ...newValue, rumour: newValue.rumour.trim() };
    };

    const handlePostSuccess = () => {
        clearNewValue();
        onPostSuccess();
    }

    const handleAbortClick = () => {
        clearNewValue();
        onAbortClick();
    }

    const disabled = !validateData();

    return (
        <div style={{ maxWidth: "700px" }}>
            <Form
                value={getSubmitData}
                url={url}
                httpVerb={httpMethod}
                disabled={disabled}
                onAbortClick={handleAbortClick}
                onSuccess={handlePostSuccess}
                noDivider
                noPadding
            >
                <Box sx={{ mb: 4 }}>
                    <TextField
                        label="Har du hørt at...?"
                        name="rumour"
                        type="text"
                        required
                        fullWidth
                        autoComplete="off"
                        value={newValue.rumour}
                        onChange={(e) => setNewValue({ ...newValue, rumour: e.target.value })}
                        multiline
                        minRows={1} />
                </Box>
            </Form>
        </div>
    );
}
