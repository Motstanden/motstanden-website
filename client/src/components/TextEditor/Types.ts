import { CustomElement, CustomText } from "common/richTextSchema";
import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor
        Element: CustomElement
        Text: CustomText
    }
}