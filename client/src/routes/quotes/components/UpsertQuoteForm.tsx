import { TextField } from "@mui/material";
import { NewQuote, Quote, Quote as QuoteData } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import { useState } from "react";
import { Form } from "src/components/form/Form";

export function UpsertQuoteForm({
    initialValue, postUrl, onAbortClick, onPostSuccess,
}: {
    initialValue: NewQuote | QuoteData;
    postUrl: string;
    onAbortClick: VoidFunction;
    onPostSuccess: VoidFunction;
}) {
    const [newValue, setNewValue] = useState<NewQuote | Quote>(initialValue);

    const validateData = () => {
        const isEmpty = isNullOrWhitespace(newValue.quote) || isNullOrWhitespace(newValue.utterer);
        const isEqual = newValue.quote.trim() === initialValue.quote.trim() && newValue.utterer.trim() === initialValue.utterer.trim();
        return !isEmpty && !isEqual;
    };

    const getSubmitData = () => {
        return { ...newValue, quote: newValue.quote.trim(), utterer: newValue.utterer.trim() };
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
                    <div>
                        <TextField
                            label="Sitat"
                            name="quote"
                            type="text"
                            required
                            fullWidth
                            autoComplete="off"
                            value={newValue.quote}
                            onChange={(e) => setNewValue({ ...newValue, quote: e.target.value })}
                            multiline
                            minRows={4}
                            sx={{ mb: 4 }} />
                    </div>
                    <div>
                        <TextField
                            label="Sitatytrer"
                            name="utterer"
                            type="text"
                            required
                            fullWidth
                            autoComplete="off"
                            value={newValue.utterer}
                            onChange={(e) => setNewValue({ ...newValue, utterer: e.target.value })}
                            sx={{ maxWidth: "450px" }} />
                    </div>
                </div>
            </Form>
        </div>
    );
}
