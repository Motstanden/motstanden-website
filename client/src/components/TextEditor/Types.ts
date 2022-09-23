import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history'
import { CustomElement, CustomText } from "common/richTextSchema"

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor
        Element: CustomElement
        Text: CustomText
    }
}