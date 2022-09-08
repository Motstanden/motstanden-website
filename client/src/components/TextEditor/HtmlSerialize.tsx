import DOMPurify from "dompurify"
import ReactDOMServer from "react-dom/server"
import { Descendant, Text, Editor } from 'slate';
import { UnsafeElement } from "./Element"
import { UnsafeLeaf } from "./Leaf"
import { CustomEditor, ElementType, FormattedText, TextFormat } from "./Types"
import { jsx } from "slate-hyperscript"

export function serialize( value: CustomEditor | Descendant[]){
    
    const children = Editor.isEditor(value) ? value.children : value
    const content = ReactDOMServer.renderToStaticMarkup(Builder({children: children})) 
    
    // It is not necessary to sanitize the content (because React has already done it).
    // But, it can only hurt performance, so lets do it anyway just to be safe.
    const cleanContent = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } })
    
    return cleanContent
}

function Builder( {children}: {children: Descendant[]}) {
    return (
        <>
            {children.map( (element, index) => <SectionBuilder key={index} element={element}/> )}
        </>
    )
}

// Recursive functions that walks down all branches from a start element
// Returns the tree as jsx elements
function SectionBuilder( { element }: { element: Descendant} ) {
    if(Text.isText(element)) {
        return <UnsafeLeaf children={element.text} leaf={element} />
    }

    const children = element.children.map( (child: Descendant, index: number) => <SectionBuilder key={index} element={child}/>)
    return <UnsafeElement children={children} element={element}/>
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

    const elType = strToElementType(el.nodeName)
    if(elType){
        return [ jsx("element", {type: elType}, children) ]
    }

    const txtFormat = strToTextFormat(el.nodeName)
    if(txtFormat) {
        const attribute = getAttribute(txtFormat)
        return  children.map(child => jsx("text", attribute, child)) // Apply text formatting to all children
    }

    return children
}

function strToElementType(nodeName: string): ElementType | undefined {
    switch(nodeName) {
        case "H2" || "H1": return ElementType.H1
        case "H3": return ElementType.H2
        case "DIV": return ElementType.Paragraph
        case "UL": return ElementType.BulletedList
        case "LI": return ElementType.ListItem
        case "OL": return ElementType.NumberedList
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