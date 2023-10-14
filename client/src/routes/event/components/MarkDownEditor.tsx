import { Tab, Tabs, TextField, Theme, useMediaQuery } from "@mui/material"
import { useState } from "react"

interface MarkDownEditorProps {
    value?: string,
    onChange?: ( value: string ) => void
    placeholder?: string
    required?: boolean,
    minRows?: number
}

export function MarkDownEditor( props: MarkDownEditorProps) {

    const [isPreview, setIsPreview] = useState(false)

    return (
        <div>
            <div style={{ marginBottom: "-1.5px" }}>
                <EditorTabs 
                    isPreview={isPreview}
                    onWriteClick={() => setIsPreview(false)}
                    onPreviewClick={() => setIsPreview(true)}
                />
            </div>

            <ContentPicker 
                {...props} 
                isPreview={isPreview}
            />
        </div>
    )
}

function EditorTabs( {
    isPreview, 
    onWriteClick,
    onPreviewClick,
}: {
    isPreview: boolean, 
    onWriteClick: () => void,
    onPreviewClick: () => void
}) {

    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const selectedTabStyle: React.CSSProperties = {
        borderTop: "1px",
        borderLeft: "1px",
        borderRight: "1px",
        borderStyle: "solid",
        borderColor: "gray",
        borderRadius: "4px",
    }

    return (
        <Tabs 
            value={isPreview ? 1 : 0}
            textColor="secondary"
            indicatorColor="secondary"
            variant={isSmallScreen ? "fullWidth" : "standard"}
        >
            <Tab
                label="Skriv"
                value={0}
                onClick={onWriteClick}
                style={isPreview ? {} : selectedTabStyle}
            />
            <Tab
                label="Forhåndsvis"
                value={1}
                onClick={onPreviewClick}
                style={isPreview ? selectedTabStyle : {}}
            />
        </Tabs>
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
    const { value, onChange, placeholder, required, minRows } = props

    const onValueChange = ( e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
        if(onChange !== undefined){
            onChange(e.target.value)
        }
    }

    return (
        <div>
            <TextField 
                multiline
                placeholder={placeholder}
                variant="outlined"
                required={required}
                fullWidth
                type="text"
                autoComplete="off"
                color="secondary"
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