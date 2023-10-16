import { NewSongLyric } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import { useState } from "react";
import { Form } from "src/components/form/Form";

export function UpsertLyricForm({
    initialValue, postUrl, onAbortClick, onPostSuccess,
}: {
    initialValue: NewSongLyric;
    postUrl: string;
    onAbortClick: VoidFunction;
    onPostSuccess: VoidFunction;
}) {
    const [newValue, setNewValue] = useState<NewSongLyric>(initialValue);

    const validateData = () => {
        const isEmpty = isNullOrWhitespace(newValue.title) || isNullOrWhitespace(newValue.content);
        const isEqual = newValue.title.trim() === initialValue.title.trim() && newValue.content.trim() === initialValue.content.trim();
        return !isEmpty && !isEqual;
    };

    const getSubmitData = (): NewSongLyric => {
        return { 
            title: newValue.title.trim(), 
            content: newValue.content.trim(), 
            isPopular: newValue.isPopular 
        };
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
                Her kommer det snart et skjema...
            </Form>
        </div>
    );
}
