import { TextField } from "@mui/material";
import { NewRumour, Rumour } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import { Form } from "src/components/form/Form";
import { useSessionStorage } from "src/hooks/useStorage";


export function UpsertRumourForm({
    initialValue, 
    postUrl, 
    storageKey,
    onAbortClick, 
    onPostSuccess,
}: {
    initialValue: NewRumour | Rumour;
    postUrl: string;
    storageKey: any[],
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
                postUrl={postUrl}
                disabled={disabled}
                onAbortClick={handleAbortClick}
                onPostSuccess={handlePostSuccess}
            >
                <div style={{ marginBottom: "-1em" }}>
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
                        minRows={2} />
                </div>
            </Form>
        </div>
    );
}
