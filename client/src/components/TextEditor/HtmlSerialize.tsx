import { CustomElement, ElementType, FormattedText } from "common/richTextSchema";
import { isNullOrWhitespace } from "common/utils";
import DOMPurify from "dompurify";
import ReactDOMServer from "react-dom/server";
import { Descendant, Editor, Text } from 'slate';
import { CustomEditor } from "./Types";

export function serialize(value: CustomEditor | Descendant[]): string {

    const children = Editor.isEditor(value) ? value.children : value

    const dirtyContent = serializeNode(children)

    // It is not necessary to sanitize the content (the serialization logic should have done this for us already).
    // But we do it anyway because it only affects performance and it can potentially catch bugs in our serialization logic.
    const cleanContent = DOMPurify.sanitize(dirtyContent, { USE_PROFILES: { html: true } })

    return cleanContent
}

function serializeNode(node: Descendant | Descendant[]): string {

    if (Array.isArray(node)) {
        return node.map(child => serializeNode(child) + `${Text.isText(child) ? "" : "\n"}`)   // Recursive serialize the children array
            .join("")
    }

    // Base case
    if (Text.isText(node)) {
        return serializeText(node)
    }

    const childStr: string = serializeNode(node.children)           // Recursive serialize children
    const elemStr: string = serializeElement(node, childStr)
    return elemStr
}

function serializeText(node: FormattedText): string {
    let txt = <>{node.text.replace(/\s\s+/g, " ")}</>
    if (node.bold) {
        txt = <strong>{txt}</strong>
    }
    if (node.italic) {
        txt = <em>{txt}</em>
    }
    if (node.underline) {
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