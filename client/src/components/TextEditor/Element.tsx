import { RenderElementProps } from "slate-react"
import { ElementType } from "common/richTextSchema"

export function Element({ attributes, children, element }: RenderElementProps ){
    switch (element.type) {
        case ElementType.H1:
            return (
                <h1 {...attributes}>
                    {children}
                </h1>
            )
        case ElementType.H2:
            return (
                <h2 {...attributes}>
                    {children}
                </h2>
            )
        case ElementType.H3:
            return (
                <h3 {...attributes}>
                    {children}
                </h3>
            )
        case ElementType.Div: 
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