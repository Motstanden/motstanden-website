import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { NewSongLyric } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarkDownEditor } from "src/components/MarkDownEditor";
import { Form } from "src/components/form/Form";
import { buildLyricItemUrl, lyricContextQueryKey } from "../Context";

export function UpsertLyricForm({
    initialValue, 
    postUrl, 
    onAbortClick, 
    usedTitles,
    onPostSuccess
}: {
    initialValue: NewSongLyric;
    postUrl: string;
    onAbortClick: VoidFunction;
    usedTitles: string[];
    onPostSuccess?: ((res: Response) => Promise<void>) | ((res: Response) => void)
}) {
    const [newValue, setNewValue] = useState<NewSongLyric>(initialValue);
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
    
    const _onPostSuccess = async (res: Response) => {
        setHasPosted(true);
        await queryClient.invalidateQueries({queryKey: lyricContextQueryKey})
        if(onPostSuccess){
            await onPostSuccess(res);
        }
        navigate(buildLyricItemUrl(newValue.title, newValue.isPopular))
     };

    const titleInUse = usedTitles.find(title => title.toLocaleLowerCase().trim() === newValue.title.toLocaleLowerCase().trim()) !== undefined;

    const disabled = !validateData() || titleInUse || hasPosted;

    return (
        <div style={{ maxWidth: "700px" }}>
            <Form
                value={getSubmitData}
                postUrl={postUrl}
                disabled={disabled}
                onAbortClick={_ => onAbortClick()}
                onPostSuccess={_onPostSuccess}
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
