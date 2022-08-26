import isHotkey from "is-hotkey"
import { toggleMark } from "./FormattedText"
import { CustomEditor, TextFormat } from "./Types"

function getTextHotkey( format: TextFormat): string {
    switch(format) {
        case TextFormat.Bold: return "mod+b"
        case TextFormat.Italic: return "mod+i"
        case TextFormat.Underline: return "mod+u"
    }
}

export function handleHotkey( editor: CustomEditor, event: React.KeyboardEvent<HTMLDivElement>, format: TextFormat) {
    const hotkey = getTextHotkey(format)
    if(isHotkey(hotkey, event)) {
        event.preventDefault()
        toggleMark(editor, format)
    }
}

export function handleAllFormatHotkeys(editor: CustomEditor, event: React.KeyboardEvent<HTMLDivElement>){
    handleHotkey(editor, event, TextFormat.Bold)
    handleHotkey(editor, event, TextFormat.Italic)
    handleHotkey(editor, event, TextFormat.Underline)
}