import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { SvgIconProps, useTheme, alpha } from "@mui/material";
import { useState } from "react";

// -------------------------------------------------------------------
//  File types
//      - Add more here if necessary
// -------------------------------------------------------------------
type ImageFileType =
    "image/*"       |
    "image/avif"    |
    "image/jpeg"    |
    "image/png"     |
    "image/webp"

type AudioFileType =
    "audio/*"       |
    "audio/flac"    |
    "uadio/mp3"     |
    "audio/mp4"     |
    "audio/mpeg"    |
    "audio/webm"

type VideoFileType =
    "video/*"       |
    "video/mpeg"    |
    "video/mp4"     |
    "video/webm"

type AppFileType =
    "application/pdf"   |
    "application/zip"


type FileType = ImageFileType & AudioFileType & VideoFileType & AppFileType
// -------------------------------------------------------------------


export default function FileDropZone({ onChange, accept }: {onChange: (newFiles: File[]) => void, accept: FileType | FileType[]}) {
    const theme = useTheme()
    
    const [isDragOver, setIsDragOver] = useState(false)
    const [isMouseOver, setIsMouseOver] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | undefined>()

    const acceptStr = Array.isArray(accept) ? accept.join(",") : accept

    const handleMouseEnter = () => {
        setIsMouseOver(true)
    }

    const handleMouseLeave = () => {
        setIsMouseOver(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(false)
        setErrorMsg(undefined)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()  // Prevent browser from handling
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(true)

        const items = e.dataTransfer.items

        if(!items)
            return setErrorMsg("");

        for(let i = 0; i < items.length; i++) {
            const item = items[i]

            if(item.kind !== "file")
                return setErrorMsg("Ikke en fil")

        }

    }

    const handleDragLeave = (_: React.DragEvent<HTMLDivElement>) => {
        setIsDragOver(false)
        setErrorMsg(undefined)
        setIsMouseOver(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!onChange)
            return;

        const files  = e.target.files 

        if(files === null)
            return onChange([]);

        const newFiles: File[] = [];
        for(const file of files) {

            // TODO: Validate file here
            newFiles.push(file)
        }
        onChange(newFiles)
    }

    const dropState: DropState = isDragOver ? ( errorMsg ? "dragError" : "dragAccept" ) : "idle"
    let zoneStyle: React.CSSProperties = {}

    if(dropState === "idle") {
        zoneStyle = isMouseOver ? {
            color: theme.palette.secondary.main,
            backgroundColor: alpha(theme.palette.secondary.main, 0.05)

        } : {
            borderStyle: "dashed",
            opacity: 0.5  
        }
    }

    if(dropState === "dragAccept") zoneStyle = {
        color: theme.palette.success.main,
        backgroundColor: alpha(theme.palette.success.main, 0.05)
    }

    if(dropState === "dragError") zoneStyle = {
        color: theme.palette.error.main,
        backgroundColor: alpha(theme.palette.error.main, 0.05)
    }

    return (
        <label>
            <input 
                type="file" 
                multiple
                accept={acceptStr} 
                style={{opacity: 0}} 
                onChange={handleInputChange}
            />
            <div 
                onDrop={handleDrop} 
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    height: "150px",
                    borderRadius: "15px",
                    cursor: "pointer",
                    borderWidth: "1.4px",
                    borderStyle: "solid",

                    ...zoneStyle,

                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                >
                <DropFeedback 
                    dropState={dropState}
                    idleMsg="Dra og slipp, eller klikk"
                    phoneIdleMsg="Klikk for å laste opp"
                    errorMsg={errorMsg ?? ""}
                    acceptMsg={"Slipp"}
                />
            </div>
        </label>
    )
}

type DropState = "idle" | "dragError" | "dragAccept"

function DropFeedback( { 
    dropState, 
    idleMsg,
    phoneIdleMsg, 
    errorMsg, 
    acceptMsg 
}: { 
    dropState: DropState, 
    idleMsg: string, 
    errorMsg: string, 
    phoneIdleMsg: string
    acceptMsg: string
}) {

    const isMobile = false // TODO

    const iconProps: SvgIconProps = {
        fontSize: "large"
    }

    let msg: string, icon: JSX.Element
    switch(dropState) {
        case 'idle': {
            msg =  isMobile ? phoneIdleMsg : idleMsg
            icon = isMobile ? <UploadFileIcon {...iconProps}/> : <FileUploadIcon {...iconProps}/>
            break;
        }
        case 'dragError': {
            msg = errorMsg
            icon = <BlockIcon {...iconProps}/>
            break;
        }
        case 'dragAccept': {
            msg = acceptMsg
            icon = <CheckIcon {...iconProps} />
            break;
        }
        default: throw "Not implemented"
    }

    return (
        <>
            <div style={{
                pointerEvents: "none",
            }}>
                {icon}
            </div>
            <div 
                style={{
                    fontSize: "small",
                    opacity: 0.7,
                    pointerEvents: "none",
                }}
            >
                {msg}
            </div>
        </>
    )
}