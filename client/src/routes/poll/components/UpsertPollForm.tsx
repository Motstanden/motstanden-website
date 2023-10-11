import { MenuItem, TextField } from "@mui/material";
import { NewPollWithOption, PollWithOption } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import { useState } from "react";
import { Form } from "src/components/form/Form";

export function UpsertPollForm({
    initialValue, 
    postUrl, 
    onAbortClick, 
    onPostSuccess,
}: {
    initialValue: NewPollWithOption | PollWithOption;
    postUrl: string;
    onAbortClick: VoidFunction;
    onPostSuccess: VoidFunction;
}) {
    const [newValue, setNewValue] = useState<NewPollWithOption | PollWithOption>(initialValue);

    const isValidData = () => {
        const isEmpty = isNullOrWhitespace(newValue.title);
        const isEqual = newValue.title.trim() === initialValue.title.trim() && 
                        newValue.type.trim() === initialValue.type.trim();
        const correctType = newValue.type === "single" || newValue.type === "multiple";
        return !isEmpty && !isEqual && correctType;
    };

    const getSubmitData = () => {
        return { 
            ...newValue, 
            title: newValue.title.trim(),
            type: newValue.type.trim(),
            options: newValue.options.map(o => ({ ...o, text: o.text.trim() })),
        }
    };

    const disabled = !isValidData();

    return (
        <div style={{ maxWidth: "600px" }}>
            <Form
                value={getSubmitData}
                postUrl={postUrl}
                disabled={disabled}
                onAbortClick={_ => onAbortClick()}
                onPostSuccess={_ => onPostSuccess()}

            >
                <div>
                    <TextField
                        label="Spørsmål"
                        name="title"
                        type="text"
                        required
                        fullWidth
                        autoComplete="off"
                        value={newValue.title}
                        onChange={(e) => setNewValue({ ...newValue, title: e.target.value })}
                        sx={{ mb: 4 }}
                        />
                </div>
                <div>
                    <TextField 
                        select
                        label="Avstemmingstype"
                        name="type"
                        required
                        fullWidth
                        autoComplete="off"
                        value={newValue.type}
                        onChange={(e) => setNewValue({ ...newValue, type: e.target.value === "multiple" ? "multiple" : "single" })}
                        sx={{ mb: 4 }}
                    >
                        <MenuItem value={"single"}>Enkeltvalg</MenuItem>
                        <MenuItem value={"multiple"}>Flervalg</MenuItem>
                    </TextField>
                </div>
            </Form>
        </div>
    );
}
