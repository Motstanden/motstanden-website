import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { NewSongLyric } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarkDownEditor } from "src/components/MarkDownEditor";
import { Form } from "src/components/form/Form";
import { useSessionStorage } from "src/hooks/useStorage";
import { buildLyricItemUrl, lyricContextQueryKey } from "../Context";

export function UpsertLyricForm({
    initialValue, 
    postUrl, 
    storageKey,
    onAbortClick, 
    usedTitles,
    onPostSuccess,
    disabled,
}: {
    initialValue: NewSongLyric
    postUrl: string
    storageKey: string,
    onAbortClick: VoidFunction
    usedTitles: string[]
    onPostSuccess?: ((res: Response) => Promise<void>) | ((res: Response) => void)
    disabled?: boolean
}) {
    const [newValue, setNewValue, clearSessionValue] = useSessionStorage<NewSongLyric>({
        key: storageKey,
        initialValue: initialValue,
        delay: 1000
    });
    const [hasPosted, setHasPosted] = useState(false);

    const queryClient = useQueryClient();
    const navigate = useNavigate();

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
    
    const handlePostSuccess = async (res: Response) => {
        setHasPosted(true);
        await queryClient.invalidateQueries({queryKey: lyricContextQueryKey})
        if(onPostSuccess){
            await onPostSuccess(res);
        }
        clearSessionValue()
        navigate(buildLyricItemUrl(newValue.title, newValue.isPopular))
     };

     const handleAbortClick = () => {
        clearSessionValue();
        onAbortClick();
     }

    const titleInUse = usedTitles.find(title => title.toLocaleLowerCase().trim() === newValue.title.toLocaleLowerCase().trim()) !== undefined;

    const isDisabled = disabled || !validateData() || titleInUse || hasPosted;

    return (
        <div style={{ maxWidth: "700px" }}>
            <Form
                value={getSubmitData}
                postUrl={postUrl}
                disabled={isDisabled}
                onAbortClick={handleAbortClick}
                onPostSuccess={handlePostSuccess}
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
