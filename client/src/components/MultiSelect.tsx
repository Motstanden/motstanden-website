import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    SxProps
} from "@mui/material"
import { ReactNode } from "react"

type Color = "primary" | "secondary" | "error" | "info" | "success" | "warning"

export function MultiSelect<T extends string>({ 
    label, 
    value,
    prettifyValue,
    onChange, 
    children,
    sx, 
    fullWidth, 
    color = "secondary" 
}: { 
    value: T[], 
    label?: string,
    prettifyValue?: (value: T) => string,
    onChange?: (value: T[]) => void, 
    children?: ReactNode,
    sx?: SxProps,
    fullWidth?: boolean,
    color?: Color,
}) {

    const handleChange = (event: SelectChangeEvent<T[]>) => {
        const newValue = event.target.value
        if(typeof newValue !== "string") {
            onChange?.(newValue)
        } 
    }

    return (
        <FormControl 
            fullWidth={fullWidth}
            color="secondary"
            variant="standard"
            sx={{
                minWidth: "250px",
                ...sx,
            }}>
            <InputLabel>
                {label}
            </InputLabel>
            <Select
                multiple
                value={value}
                color={color}
                onChange={handleChange}
                sx={{height: "100%"}}
                renderValue={(selected) => (
                    <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 0.5,
                        mt: 0.2,
                        mb: 0.5,
                    }}>
                        {selected.map((selectedValue) => (
                            <Chip 
                                key={selectedValue} 
                                label={prettifyValue === undefined ? selectedValue : prettifyValue(selectedValue)} 
                                color={color}
                                variant="outlined"
                                size="small"
                                
                            />
                        ))}
                    </Box>
                )}
                MenuProps={{
                    color: color,
                }}
            >
                {children}
            </Select>
        </FormControl>
    )
}