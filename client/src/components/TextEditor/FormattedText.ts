import { BaseEditor, Editor } from 'slate';
import { ReactEditor } from 'slate-react';
import { CustomEditor, CustomElement, TextFormat } from './Types';

export function isMarkActive (editor: CustomEditor, format: TextFormat): boolean {
    const marks = Editor.marks(editor)
    switch(format){
        case TextFormat.Bold:   
            return marks?.bold === true
        case TextFormat.Italic: 
            return marks?.italic === true
        case TextFormat.Underline:
            return marks?.underline === true
    }
}    


export function toggleMark(editor: CustomEditor, format: TextFormat) {
    const isActive = isMarkActive(editor, format)
    setMark(editor, format, !isActive)
}

export function setMark(editor: CustomEditor, format: TextFormat, value: boolean) {
    if(value) {
        Editor.addMark(editor, formatToMarkStr(format), true)
    } else {
        Editor.removeMark(editor, formatToMarkStr(format))
    }
}

function formatToMarkStr(format: TextFormat): string {
    switch (format) {
        case TextFormat.Bold:       return "bold"
        case TextFormat.Italic:     return "italic"
        case TextFormat.Underline:  return "underline"
    }
}