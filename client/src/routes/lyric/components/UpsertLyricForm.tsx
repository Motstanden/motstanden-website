import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material"
import { NewSongLyric } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import { useState } from "react"
import { MarkDownEditor } from "src/components/MarkDownEditor"
import { Form } from "src/components/form/Form"
import { StorageKeyArray, useSessionStorage } from "src/hooks/useStorage"

export function UpsertLyricForm({
    initialValue, 
    url, 
    httpVerb,
    storageKey,
    onAbortClick, 
    usedTitles,
    disabled,
    onPostSuccess
}: {
    initialValue: NewSongLyric
    url: string
    storageKey: StorageKeyArray,
    httpVerb: "POST" | "PATCH"
    onAbortClick: VoidFunction
    usedTitles: string[]
    disabled?: boolean,
    onPostSuccess?: ( (newValue: NewSongLyric) => void )| ( (newValue: NewSongLyric) => Promise<void> )
}) {
    const [newValue, setNewValue, clearNewValue] = useSessionStorage<NewSongLyric>({
        key: storageKey,
        initialValue: initialValue,
        delay: 1000
    });
    const [hasPosted, setHasPosted] = useState(false);

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
    
    const handlePostSuccess = async () => {
        setHasPosted(true);
        clearNewValue()
        await onPostSuccess?.(newValue);
     };

     const handleAbortClick = () => {
        clearNewValue();
        onAbortClick();
     }

    const titleInUse = usedTitles.find(title => title.toLocaleLowerCase().trim() === newValue.title.toLocaleLowerCase().trim()) !== undefined;

    const isDisabled = disabled || !validateData() || titleInUse || hasPosted;

    return (
        <div style={{ maxWidth: "700px" }}>
            <Form
                value={getSubmitData}
                httpVerb={httpVerb}
                url={url}
                disabled={isDisabled}
                onAbortClick={handleAbortClick}
                onSuccess={handlePostSuccess}
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
                        error={!hasPosted && titleInUse}
                    />
                    {!hasPosted && titleInUse && 
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
