import { TextField } from "@mui/material";
import { NewRumour, Rumour } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import { useState } from "react";
import { Form } from "src/components/form/Form";


export function UpsertRumourForm({
    initialValue, postUrl, onAbortClick, onPostSuccess,
}: {
    initialValue: NewRumour | Rumour;
    postUrl: string;
    onAbortClick: VoidFunction;
    onPostSuccess: VoidFunction;
}) {
    const [newValue, setNewValue] = useState<NewRumour | Rumour>(initialValue);

    const validateData = () => {
        const isEmpty = isNullOrWhitespace(newValue.rumour);
        const isEqual = newValue.rumour.trim() === initialValue.rumour.trim();
        return !isEmpty && !isEqual;
    };

    const getSubmitData = () => {
        return { ...newValue, rumour: newValue.rumour.trim() };
    };

    const disabled = !validateData();

    return (
        <div style={{ maxWidth: "700px" }}>
            <Form
                value={getSubmitData}
                postUrl={postUrl}
                disabled={disabled}
                onAbortClick={_ => onAbortClick()}
                onPostSuccess={_ => onPostSuccess()}
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
