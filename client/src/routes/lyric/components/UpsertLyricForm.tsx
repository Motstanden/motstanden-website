import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { NewSongLyric } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import { useState } from "react";
import { MarkDownEditor } from "src/components/MarkDownEditor";
import { Form } from "src/components/form/Form";

export function UpsertLyricForm({
    initialValue, 
    postUrl, 
    onAbortClick, 
    onPostSuccess,
    usedTitles,
}: {
    initialValue: NewSongLyric;
    postUrl: string;
    onAbortClick: VoidFunction;
    onPostSuccess: VoidFunction;
    usedTitles: string[];
}) {
    const [newValue, setNewValue] = useState<NewSongLyric>(initialValue);

    const validateData = () => {
        const isEmpty = isNullOrWhitespace(newValue.title) || isNullOrWhitespace(newValue.content);
        const isEqual = newValue.title.trim() === initialValue.title.trim() 
            && newValue.content.trim() === initialValue.content.trim() 
            && newValue.isPopular === initialValue.isPopular;

        return !isEmpty && !isEqual;
    };

    
    const getSubmitData = (): NewSongLyric => {
        return { 
            title: newValue.title.trim(), 
            content: newValue.content.trim(), 
            isPopular: newValue.isPopular 
        };
    };
    
    const titleInUse = usedTitles.find(title => title.toLocaleLowerCase().trim() === newValue.title.toLocaleLowerCase().trim()) !== undefined;

    const disabled = !validateData() || titleInUse;

    return (
        <div style={{ maxWidth: "700px" }}>
            <Form
                value={getSubmitData}
                postUrl={postUrl}
                disabled={disabled}
                onAbortClick={_ => onAbortClick()}
                onPostSuccess={_ => onPostSuccess()}
            >
                <div>
                    <TextField 
                        label="Tittel"
                        name="title"
                        type="text"
                        required
                        fullWidth
                        autoComplete="off"
                        value={newValue.title}
                        onChange={e => setNewValue((oldValue) => ({ ...oldValue, title: e.target.value }))}
                        error={titleInUse}
                    />
                    {titleInUse && 
                        <Box 
                            color="error.main" 
                            style={{marginTop: "4px"}}>
                                Tittelen er allerede i bruk...
                        </Box>}
                </div>
                <div>
                    <FormControlLabel 
                        label="Populær" 
                        control={
                            <Checkbox 
                                checked={newValue.isPopular} 
                                onChange={ (_, checked) => setNewValue(oldVal => ({...oldVal, isPopular: checked}))} 
                            />
                        }
                        sx={{mb: 4, mt: 2.5}}
                        style={{marginLeft: "-5px", paddingLeft: "0px"}}
                        />
                </div>
                <div>
                    <MarkDownEditor 
                        minRows={10}
                        value={newValue.content}
                        onChange={val => setNewValue(oldValue => ({ ...oldValue, content: val }))}
                        placeholder="Skriv inn trallen her..."
                    />
                </div>
            </Form>
        </div>
    );
}
