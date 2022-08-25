import { RenderElementProps, RenderLeafProps } from "slate-react"
import { CustomElement, ElementType, FormattedText } from "./Types"

export function Element({ attributes, children, element }: RenderElementProps ){
    return <UnsafeElement 
                attributes={attributes} 
                children={children} 
                element={element}
            />
}

// This interface is a hack that tells React that 'attributes' is an optional property
// This is unsafe because attributes is required by slate.
//
// Why do we need this hack?
//      - Because attributes are managed by the slate editor and we want to build the html content without using the editor.
//      - This makes serialization easier 
interface UnsafeRenderElementProps extends Partial<RenderElementProps> {
    children: any
    element: CustomElement,
}

export function UnsafeElement( { attributes, children, element }: UnsafeRenderElementProps ) {
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