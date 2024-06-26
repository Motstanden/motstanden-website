import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from "@mui/lab";
import { Paper, Stack, TextField, Theme, useMediaQuery, useTheme } from "@mui/material";
import { NewWallPost } from "common/interfaces";
import { isNullOrWhitespace } from 'common/utils';
import { useState } from "react";
import { useAuthenticatedUser } from "src/context/Authentication";
import { StorageKeyArray, useSessionStorage } from 'src/hooks/useStorage';
import { postJson } from 'src/utils/postJson';
import { UserAvatar } from '../user/UserAvatar';

export function NewPostForm({
    initialValue, 
    storageKey, 
    style, 
    onPostSuccess, 
    userFirstName,
}: {
    initialValue: NewWallPost;
    storageKey: StorageKeyArray;
    onPostSuccess?: ((res: Response) => Promise<void>) | ((res: Response) => void);
    style?: React.CSSProperties;
    userFirstName?: string;
}) {
    const theme = useTheme();

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const { user } = useAuthenticatedUser();
    const isSelf = user.id === initialValue.wallUserId;
    const label = useRandomLabel(isSelf, userFirstName);

    const [value, setValue, clearValue] = useSessionStorage<NewWallPost>({
        initialValue: initialValue,
        key: storageKey
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newValue: NewWallPost = {
            ...value,
            content: value.content.trim()
        };

        const response = await postJson(`/api/wall-posts`, newValue, { alertOnFailure: true });

        if (response && response.ok) {
            onPostSuccess && await onPostSuccess(response);
            setValue(initialValue);
        }

        clearValue();
        setIsSubmitting(false);
    };

    const disabled = isNullOrWhitespace(value.content);

    return (
        <Paper
            elevation={2}
            style={{
                paddingBlock: "20px",
                paddingInline: isSmallScreen ? "10px" : "20px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: theme.palette.divider,
                ...style,
            }}
        >
            <form onSubmit={onSubmit}>
                <Stack
                    direction="row"
                >
                    <UserAvatar
                        userId={user.id}
                        style={{
                            marginTop: "5px",
                            display: isSmallScreen ? "none" : "inherit",
                            marginRight: "12px"
                        }} />
                    <div
                        style={{
                            width: "100%"
                        }}>
                        <TextField
                            type="text"
                            label={label}
                            required
                            fullWidth
                            multiline
                            autoComplete="off"
                            aria-label='Skriv en ny veggpost...'
                            minRows={1}
                            value={value.content}
                            onChange={(e) => setValue(oldVal => ({ ...oldVal, content: e.target.value }))}
                            sx={{
                                mb: 3
                            }}
                            disabled={isSubmitting} />
                        <LoadingButton
                            type="submit"
                            loading={isSubmitting}
                            variant="contained"
                            loadingPosition="end"
                            endIcon={<SendIcon />}
                            disabled={disabled}
                            style={{
                                minWidth: "120px"
                            }}
                        >
                            Post
                        </LoadingButton>
                    </div>
                </Stack>
            </form>
        </Paper>
    )
}

function useRandomLabel(isSelf: boolean, userFirstName?: string) {
    const [value] = useState(() => {
        
        const labels = !isSelf && userFirstName
            ? friendGreetLabels(userFirstName)
            : selfGreetLabels;
        
        const label = labels[Math.floor(Math.random() * labels.length)];
        
        return label;
    })
    
    return value;
}

const selfGreetLabels: string[] = [
    `Hva tenker du på...?`,
    `Hva gjør du nå...?`,
    `Hvilke planer har du i dag...?`,
    `Fortell noe om deg selv...`,
    `Hva skjer...?`,
    `Hva spiste du til middag...?`,
    `Hva er planene for helgen...?`,
    `Kommer du på øvelse...?`,
    `Si noe personlig om deg selv...`,
    `Hva er din favorittfilm...?`,
    `Hva er din favorittserie...?`,
    `Hva er din favorittbok...?`,
    `Hva er din dypeste hemmelighet...?`,
    `Hvordan er formen...?`,
    `Hva gjorde du i helgen...?`,
    `Hva er din favorittligning i matematikken...?`,
    `Hvem er din favorittforeleser...?`,
    `Hva er din favorittligning i fysikken...?`,
    `Hva er din favorittligning innefor elektro...?`,
]

const friendGreetLabels = (name: string): string[] => [
    `Si hei til ${name}...`,
    `Gi en hilsen til ${name}...`,
    `Lovpris ${name}...`,
    `Fortell ${name} hva du tenker på...`,
    `Gratuler ${name} med dagen...??`,
    `Si noe fint til ${name}...`,
    `Si noe personlig til ${name}...`,
]
