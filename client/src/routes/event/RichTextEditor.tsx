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
    withReact
    } from 'slate-react';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { HistoryEditor, withHistory } from 'slate-history'

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

type HeadingElement = {
    type: ElementType.Heading,
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

function EditorContainer() {
    return (
        <div style={{
            padding: "10px",
            border: "1px solid gray",
            borderRadius: "10px",
            minHeight: "50px"
        }}>
            <TextEditor/>
        </div>
    )
}

const initialValue: Descendant[] = [{
    type: ElementType.Paragraph,
    children: [
        { text: ""}
    ]
}]

function TextEditor() {
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])     // Production
    // const [editor] = useState(withHistory(withReact(createEditor())))         // Development
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
            <Editable 
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                spellCheck
                onKeyDown={event => {
                    handleHotkey(event, TextFormat.Bold)
                    handleHotkey(event, TextFormat.Italic)
                    handleHotkey(event, TextFormat.Underline)
                }}
            />
        </Slate>
    )
}

function Element( { attributes, children, element }: RenderElementProps ) {
    switch (element.type) {
        case ElementType.Heading:
            return (
                <h1 {...attributes}>
                    {children}
                </h1>
            )
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

function ToggleMark(editor: CustomEditor, format: TextFormat){
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

export {EditorContainer as RichTextEditor}