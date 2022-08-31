import DOMPurify from "dompurify"
import ReactDOMServer from "react-dom/server"
import { Descendant, Text, Editor } from 'slate';
import { UnsafeElement } from "./Element"
import { UnsafeLeaf } from "./Leaf"
import { CustomEditor } from "./Types"

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
