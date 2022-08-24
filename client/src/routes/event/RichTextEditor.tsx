import React, { useCallback, useMemo, useState } from 'react';
import { BaseEditor, Text, Transforms } from 'slate';
import isHotkey from 'is-hotkey'
import {
    createEditor,
    Descendant,
    Editor,
    NodeMatch
    } from 'slate';
import {
    Editable,
    RenderLeafProps,
    Slate,
    useSlate,
    withReact
    } from 'slate-react';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { HistoryEditor, withHistory } from 'slate-history'

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';

enum TextFormat {
    Bold = "bold",
    Italic = "italic",
    Underline = "underline"
}

function GetTextHotkey( format: TextFormat): string {
    switch(format) {
        case TextFormat.Bold: return "mod+b"
        case TextFormat.Italic: return "mod+i"
        case TextFormat.Underline: return "mod+u"
    }
}

enum ElementType {
    H1 = "h1",
    H2 = "h2",
    Paragraph = "paragraph",
    NumberedList = "numbered-list",
    BulletedList = "bulleted-list",
    ListItem = "list-item"
}

type HeadingOneElement = {
    type: ElementType.H1,
    children: CustomText[]
}

type HeadingTwoElement = {
    type: ElementType.H2,
    children: CustomText[]
}

type ParagraphElement = {
    type: ElementType.Paragraph,
    children: CustomText[]
}

type ListItemElement = {
    type: ElementType.ListItem,
    children: CustomText[]
}


type NumberedListElement = {
    type: ElementType.NumberedList,
    children: ListItemElement[]
}

type BulletedListElement = {
    type: ElementType.BulletedList,
    children: ListItemElement[]
}

type FormattedText = { 
    text: string, 
    bold?: true,
    italic?: true,
    underline?: true
}

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor
type CustomElement = HeadingOneElement | HeadingTwoElement | ParagraphElement | NumberedListElement | BulletedListElement | ListItemElement
type CustomText = FormattedText

interface IElement {
    type: CustomElement,
    children: CustomText[]    
}


declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor
        Element: CustomElement
        Text: CustomText
    }
}

function EditorContainer( {children}: {children: React.ReactNode}) {
    return (
        <>
        <div>
            <Toolbar/>
        </div>
        <div style={{
            padding: "10px",
            border: "1px solid gray",
            minHeight: "50px",
            marginTop: "10px"
        }}>
            {children}
        </div>
        </>
    )
}

const initialValue: Descendant[] = [
    {
        type: ElementType.Paragraph,
        children: [
            { text: ""}
        ]
    }, {
        type: ElementType.NumberedList,
        children: [
            {
                type: ElementType.ListItem,
                children: [ { text: "Hei" }]
            }
        ]
    }, {
        type: ElementType.BulletedList,
        children: [
            {
                type: ElementType.ListItem,
                children: [ { text: "Hei" }]
            }
        ]
    }
]

function TextEditor() {
    // const editor = useMemo(() => withHistory(withReact(createEditor())), [])        // Production
    const [editor] = useState(withHistory(withReact(createEditor())))            // Development
    const renderElement = useCallback( (props: RenderElementProps) => <Element {...props} />, [])
    const renderLeaf = useCallback( (props: RenderLeafProps) => <Leaf {...props}/>, [])

    const handleHotkey = (event: React.KeyboardEvent<HTMLDivElement>, format: TextFormat) => {
        const hotkey = GetTextHotkey(format)
        if(isHotkey(hotkey, event)) {
            event.preventDefault()
            ToggleMark(editor, format)
        }
    }

    return (
        <Slate editor={editor}  value={initialValue}>
            <EditorContainer>
                <Editable 
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    spellCheck
                    placeholder='Beskrivelse av arrangement'
                    onKeyDown={event => {
                        handleHotkey(event, TextFormat.Bold)
                        handleHotkey(event, TextFormat.Italic)
                        handleHotkey(event, TextFormat.Underline)
                    }}
                />
            </EditorContainer>
        </Slate>
    )
}

function TextFormatButtons() {
    const editor = useSlate()

    const onChange = ( event: React.MouseEvent<HTMLElement>, newFormats: TextFormat[]) => {
        newFormats.forEach( format => {
            ToggleMark(editor, format)
        })
    }

    const buildValue = (value: TextFormat[], format: TextFormat): TextFormat[] => {
        if(IsMarkActive(editor, format)) {
            return [...value, format]
        }
        return value
    }

    let values: TextFormat[] = []
    values = buildValue(values, TextFormat.Bold)
    values = buildValue(values, TextFormat.Italic)
    values = buildValue(values, TextFormat.Underline)

    return (
        <ToggleButtonGroup value={values} onChange={onChange}>
            <ToggleButton value={TextFormat.Bold} >
                <FormatBoldIcon/>
            </ToggleButton>
            <ToggleButton value={TextFormat.Italic}>
                <FormatItalicIcon/>
            </ToggleButton>
            <ToggleButton value={TextFormat.Underline}>
                <FormatUnderlinedIcon/>
            </ToggleButton>
        </ToggleButtonGroup>
    )
}


function BlockElementButtons() {
    const editor = useSlate()

    const isMatch = ( type: ElementType ): boolean => {
        const [match]: any = Editor.nodes(editor, {
            match: (n: any) => n.type === type
        })
        return !!match
    }

    const onChange = ( event: React.MouseEvent<HTMLElement>, newType: ElementType) => {

        Transforms.unwrapNodes(editor, {
            match: (n: any) => n.type === ElementType.BulletedList || n.type === ElementType.NumberedList,
            split: true
        })

        const isList = newType === ElementType.BulletedList || newType === ElementType.NumberedList
        Transforms.setNodes(
            editor,
            {type: isList ? ElementType.ListItem : newType },
            { match: n => Editor.isBlock(editor, n)}
        )
        if(isList) {
            Transforms.wrapNodes(editor, { type: newType, children: [] })
        }
    }

    let value = undefined;
    value = isMatch(ElementType.H1) ? ElementType.H1 : value
    value = isMatch(ElementType.H2) ? ElementType.H2 : value
    value = isMatch(ElementType.BulletedList) ? ElementType.BulletedList : value
    value = isMatch(ElementType.NumberedList) ? ElementType.NumberedList : value

    console.log(value)
    return (
        <ToggleButtonGroup 
            exclusive
            value={value}
            onChange={onChange}
            >
            <ToggleButton value={ElementType.H1} >
                <strong>
                    H1
                </strong>
            </ToggleButton>
            <ToggleButton value={ElementType.H2}>
                <strong>
                    H2
                </strong>
            </ToggleButton>
            <ToggleButton value={ElementType.BulletedList}>
                <FormatListBulletedIcon/>
            </ToggleButton>
            <ToggleButton value={ElementType.NumberedList}>
                <FormatListNumberedIcon/>
            </ToggleButton>
        </ToggleButtonGroup>
    )
} 

function Toolbar(){

    return (
        <Stack spacing={2} direction="row" alignItems="center">
            <TextFormatButtons/>
            <BlockElementButtons/>
        </Stack>
    )

}

function Element( { attributes, children, element }: RenderElementProps ) {
    switch (element.type) {
        case ElementType.H1:
            return (
                <h2 {...attributes}>
                    {children}
                </h2>
            )
        case ElementType.H2:
            return (
                <h3 {...attributes}>
                    {children}
                </h3>
            )
        case ElementType.Paragraph: 
            return (
                <div {...attributes}>
                    {children}
                </div>
            )
        case ElementType.NumberedList: 
            return (
                <ol {...attributes}>
                    {children}
                </ol>
            )
        case ElementType.BulletedList: 
            return (
                <ul {...attributes}>
                    {children}
                </ul>
            )
        case ElementType.ListItem: 
            return (
                <li {...attributes}>
                    {children}
                </li>
            )
        default:
            return (
                <div {...attributes}>
                    {children}
                </div>
            )
    }
}

function Leaf( {attributes, children, leaf}: RenderLeafProps) {
    if (leaf.bold) {
        children = <strong>{children}</strong>
      }
    
      if (leaf.italic) {
        children = <em>{children}</em>
      }
    
      if (leaf.underline) {
        children = <u>{children}</u>
      }
    
      return <span {...attributes}>{children}</span>
}

function ToggleMark(editor: CustomEditor, format: TextFormat) {
    const isActive = IsMarkActive(editor, format)

    if(isActive) {
        Editor.removeMark(editor, format.toString())
    } else {
        Editor.addMark(editor, format.toString(), true)
    }
}

function IsMarkActive(editor: CustomEditor, format: TextFormat): boolean {
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

export {TextEditor as RichTextEditor}