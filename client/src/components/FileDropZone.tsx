import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { SvgIconProps } from "@mui/material";
import { useState } from "react";
import styles from "./FileDropZone.module.css";

export default function FileDropZone({ onChange, accept }: {onChange: (newFiles: File[]) => void, accept: string}) {

    const [isDragOver, setIsDragOver] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | undefined>()

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

    return (
            <label>
                <input 
                    type="file" 
                    multiple
                    accept={accept} 
                    style={{opacity: 0}} 
                    onChange={handleInputChange} 
                />
                <div 
                    className={styles.dropZone} 
                    onDrop={handleDrop} 
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
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
                pointerEvents: "none"
            }}>
                {icon}
            </div>
            <div 
                style={{
                    fontSize: "small",
                    opacity: 0.7,
                    pointerEvents: "none"
                }}
            >
                {msg}
            </div>
        </>
    )
}