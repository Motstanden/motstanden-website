import { TextField } from "@mui/material"

export function MarkDownEditor( {
    value,
    onChange,
    label,
    required,
    minRows,
}: {
    value?: string,
    onChange?: ( value: string ) => void
    label?: string
    required?: boolean,
    minRows?: number
} ) {

    const onValueChange = ( e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
        if(onChange !== undefined){
            onChange(e.target.value)
        }
    }

    return (
        <div>
            <TextField 
                label={label}
                multiline
                required={required}
                fullWidth
                type="text"
                autoComplete="off"
                value={value}
                onChange={onValueChange}
                minRows={minRows}
            />
        </div>
    )
}