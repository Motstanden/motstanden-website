import { RenderLeafProps } from "slate-react"
import { FormattedText } from "./Types"

export function Leaf( {attributes, children, leaf}: RenderLeafProps) {
    return <UnsafeLeaf
                attributes={attributes}
                children={children}
                leaf={leaf}
            />
}

// This interface is a hack that tells React that 'attributes' is an optional property
// This is unsafe because attributes is required by slate.
//
// Why do we need this hack?
//      - Because attributes are managed by the slate editor and we want to build the html content without using the editor.
//      - This makes serialization easier 
interface UnsafeRenderLeafProps extends Partial<RenderLeafProps> {
    children: any
    leaf: FormattedText,
}

export function UnsafeLeaf( {attributes, children, leaf}: UnsafeRenderLeafProps) {

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
