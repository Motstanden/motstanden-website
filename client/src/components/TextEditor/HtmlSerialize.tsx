import React from "react"
import DOMPurify from "dompurify"
import ReactDOMServer from "react-dom/server"
import { Descendant, Text, Editor } from 'slate';
import { CustomEditor, CustomElement, ElementType, FormattedText, TextFormat } from "./Types"
import { jsx } from "slate-hyperscript"
import { isNullOrWhitespace } from "src/utils/isNullOrWhitespace";

export function serialize( value: CustomEditor | Descendant[]): string{
    
    const children = Editor.isEditor(value) ? value.children : value

    const dirtyContent = serializeNode(children)

    // It is not necessary to sanitize the content (the serialization logic should have done this for us already).
    // But we do it anyway because it only affects performance and it can potentially catch bugs in our serialization logic.
    const cleanContent = DOMPurify.sanitize(dirtyContent, { USE_PROFILES: { html: true } })
    
    return cleanContent
}

function serializeNode(node: Descendant | Descendant[]): string {
    
    if(Array.isArray(node)){
        return node.map( child => serializeNode(child) + `${Text.isText(child) ? "" : "\n"}`)   // Recursive serialize the children array
                   .join("") 
    }

    // Base case
    if(Text.isText(node)) {
        return serializeText(node)
    }

    const childStr: string = serializeNode(node.children)           // Recursive serialize children
    const elemStr: string  = serializeElement(node, childStr) 
    return elemStr
}   

function serializeText(node: FormattedText): string {
    let txt = <>{node.text.replace(/\s\s+/g, " ")}</>
    if(node.bold) {
        txt = <strong>{txt}</strong>
    }
    if(node.italic) {
        txt = <em>{txt}</em>
    }
    if(node.underline){
        txt = <u>{txt}</u>
    }
    return ReactDOMServer.renderToString(txt)
}

function serializeElement(node: CustomElement, childStr: string) {
    switch (node.type) {
        case ElementType.Div: 
            return isNullOrWhitespace(childStr) 
                ? `<br/>` 
                : `<div>${childStr}</div>`
        case ElementType.H1: return `<h1>${childStr}</h1>`
        case ElementType.H2: return `<h2>${childStr}</h2>`
        case ElementType.H3: return `<h3>${childStr}</h3>`
        case ElementType.ListItem: return `<li>${childStr}</li>`
        case ElementType.BulletedList: return `<ul>${childStr}</ul>`
        case ElementType.NumberedList: return `<ol>${childStr}</ol>`
        default: return `<div>${childStr}</div>`
    }
}

function deserializeString(html: string){
    const node = new DOMParser().parseFromString(html, 'text/html')
    return deserializeNode(node.body)
}

function deserializeNode(el: HTMLElement | ChildNode): Descendant[] {

    // Base case: node is text 
    if(el.nodeType === Node.TEXT_NODE) {
        return [ {text: el.textContent ?? ""} ]
    }

    // Recursively deserialize all children
    let children = Array.from(el.childNodes)
                        .map(deserializeNode)
                        .flat()

    if (children.length === 0) {
        children = [{ text: '' }]
    }

    const elType = strToElementType(el.nodeName)
    if(elType){
        return [ jsx("element", {type: elType}, children) ]
    }

    const txtFormat = strToTextFormat(el.nodeName)
    if(txtFormat) {
        const attribute = getAttribute(txtFormat)
        return  children.map(child => jsx("text", attribute, child)) // Apply text formatting to all children
    }

    children = children.map( child => {
        // This should never happen if the data is correctly formatted in the database. 
        // However, lets just assume that bad data will at some point be stored in the database.
        if(Text.isText(child)){
            return jsx("element", {type: ElementType.Div}, child)
        }
        return child
    })    

    return children
}

function strToElementType(nodeName: string): ElementType | undefined {
    switch(nodeName) {
        case "H1": return ElementType.H1
        case "H2": return ElementType.H2
        case "H3": return ElementType.H3
        case "UL": return ElementType.BulletedList
        case "LI": return ElementType.ListItem
        case "OL": return ElementType.NumberedList
        case "DIV": return ElementType.Div
        default: return undefined
    }
}

function strToTextFormat(nodeName: string): TextFormat | undefined {
    switch(nodeName) {
        case "STRONG": return TextFormat.Bold
        case "EM": return TextFormat.Italic
        case "U": return TextFormat.Underline
        default: return undefined
    }
}

function getAttribute(format: TextFormat): Partial<FormattedText> {
    switch(format) {
        case TextFormat.Bold:       return {bold: true}
        case TextFormat.Italic:     return {italic: true}
        case TextFormat.Underline:  return {underline: true}
    }
}

export { deserializeString as deserialize }