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
    Heading = "heading",
    Paragraph = "paragraph"
}

enum HeadingLevel {
    H1 = 1,
    H2 = 2
}

type HeadingElement = {
    type: ElementType.Heading,
    level: HeadingLevel
    children: CustomText[]
}

type ParagraphElement = {
    type: ElementType.Paragraph,
    children: CustomText[]
}

type FormattedText = { 
    text: string, 
    bold?: true,
    italic?: true,
    underline?: true
}

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor
type CustomElement = HeadingElement | ParagraphElement
type CustomText = FormattedText

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

    const isMatch = (level: HeadingLevel) => {
        const [match]: any = Editor.nodes(editor, {
            match: (n: any) => n.type === ElementType.Heading && n.level === level
        })
        return !!match
    }

    const onChange = ( event: React.MouseEvent<HTMLElement>, newLevel: HeadingLevel) => {
        const newNode = newLevel 
                      ? { type: ElementType.Heading, level: newLevel }
                      : { type: ElementType.Paragraph }

        Transforms.setNodes(
            editor,
            newNode,
            { match: n => Editor.isBlock(editor, n)}
        )

    }

    let value = undefined;
    value = isMatch(HeadingLevel.H2) ? HeadingLevel.H2 : value;
    value = isMatch(HeadingLevel.H1) ? HeadingLevel.H1 : value;

    return (
        <ToggleButtonGroup 
            exclusive
            value={value}
            onChange={onChange}
            >
            <ToggleButton value={HeadingLevel.H1} >
                <strong>
                    H1
                </strong>
            </ToggleButton>
            <ToggleButton value={HeadingLevel.H2}>
                <strong>
                    H2
                </strong>
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
        case ElementType.Heading: {

            if(element.level == HeadingLevel.H1) {
                return (
                    <h2 {...attributes}>
                        {children}
                    </h2>
                )
            }
            else {
                return (
                    <h3 {...attributes}>
                        {children}
                    </h3>
                )
            }
        }
        case ElementType.Paragraph: 
            return (
                <div {...attributes}>
                    {children}
                </div>
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