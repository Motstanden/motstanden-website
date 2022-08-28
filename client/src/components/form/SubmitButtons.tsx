import LoadingButton from "@mui/lab/LoadingButton"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"

import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function SubmitFormButtons( { 
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
                startIcon={<ArrowBackIcon/>} 
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
                endIcon={<SaveIcon/>}
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