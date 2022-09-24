import { RenderLeafProps } from "slate-react"

export function Leaf( {attributes, children, leaf}: RenderLeafProps) {

    const isBold = !!leaf.bold
    const isItalic = !!leaf.italic
    const isUnderline = !!leaf.underline

    if(!isBold && !isItalic && !isUnderline){
        return <span {...attributes}>{children}</span>
    }

    if (leaf.bold) {
        const attrs = isItalic || isUnderline ? {} : attributes
        children = <strong {...attrs} >{children}</strong>
    }
    
    if (leaf.italic) {
        const attrs = isUnderline ? {} : attributes
        children = <em {...attrs}>{children}</em>
    }
    
    if (leaf.underline) {
        children = <u {...attributes}>{children}</u>
    }

    return children
}
