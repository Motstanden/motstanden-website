import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history'

export enum TextFormat {
    Bold = "bold",
    Italic = "italic",
    Underline = "underline"
}

export enum ElementType {
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    Paragraph = "paragraph",
    NumberedList = "numbered-list",
    BulletedList = "bulleted-list",
    ListItem = "list-item",
}

export type H1Element = {
    type: ElementType.H1,
    children: CustomText[]
}

export type H2Element = {
    type: ElementType.H2,
    children: CustomText[]
}

export type H3Element = {
    type: ElementType.H3,
    children: CustomText[]
}

export type ParagraphElement = {
    type: ElementType.Paragraph,
    children: CustomText[]
}

export type ListItemElement = {
    type: ElementType.ListItem,
    children: CustomText[]
}

export type NumberedListElement = {
    type: ElementType.NumberedList,
    children: ListItemElement[]
}

export type BulletedListElement = {
    type: ElementType.BulletedList,
    children: ListItemElement[]
}

export type FormattedText = { 
    text: string, 
    bold?: true,
    italic?: true,
    underline?: true
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor
export type CustomElement = H1Element | H2Element | H3Element | ParagraphElement | NumberedListElement | BulletedListElement | ListItemElement
export type CustomText = FormattedText

declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor
        Element: CustomElement
        Text: CustomText
    }
}