import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

export default function SubmitFormButtons({
    onAbort,
    loading,
    disabled
}: {
    onAbort: React.MouseEventHandler<HTMLButtonElement> | undefined
    loading?: boolean,
    disabled?: boolean,
}) {
    return (
        <Stack direction="row" justifyContent="space-between">
            <Button
                startIcon={<ArrowBackIcon />}
                color="error"
                variant="outlined"
                disabled={loading}
                onClick={onAbort}
                style={{
                    minWidth: "120px"
                }}
            >
                Avbryt
            </Button>
            <LoadingButton
                type="submit"
                loading={loading}
                endIcon={<SaveIcon />}
                variant="contained"
                loadingPosition="end"
                disabled={disabled}
                style={{
                    minWidth: "120px"
                }}
            >
                Lagre
            </LoadingButton>
        </Stack>
    )
}