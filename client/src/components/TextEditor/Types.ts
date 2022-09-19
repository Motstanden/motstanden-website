import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history'


// The string values of the following enums corresponds to their HTML DOM Node counterpart.
// They should match the well known property Node.nodeName: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName
export enum TextFormat {
    Bold = "STRONG",
    Italic = "EM",
    Underline = "U"
}

export enum ElementType {
    H1 = "H1",
    H2 = "H2",
    H3 = "H3",
    Paragraph = "DIV",      // TODO: Fix this ugliness
    NumberedList = "OL",
    BulletedList = "UL",
    ListItem = "LI",
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