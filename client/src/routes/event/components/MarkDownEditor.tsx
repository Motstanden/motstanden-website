import { TextField } from "@mui/material"
import { useState } from "react"

interface MarkDownEditorProps {
    value?: string,
    onChange?: ( value: string ) => void
    label?: string
    required?: boolean,
    minRows?: number

}

export function MarkDownEditor( props: MarkDownEditorProps) {

    const [isPreview, setIsPreview] = useState(false)

    return (
        <div>
            <ContentPicker 
                {...props} 
                isPreview={isPreview}
            />
        </div>
    )
}

interface ContentPickerProps extends MarkDownEditorProps {
    isPreview: boolean
}

function ContentPicker(props: ContentPickerProps){
    const {isPreview, ...mdProps} = props
    return isPreview 
        ? <MarkDownReader/> 
        : <MarkDownWriter {...mdProps}/>
}

function MarkDownWriter( props: MarkDownEditorProps ) {
    const { value, onChange, label, required, minRows } = props

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

function MarkDownReader(){
    return (
        <div>
            Kommer snart...
        </div>
    )
}