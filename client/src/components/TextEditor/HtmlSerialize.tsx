import DOMPurify from "dompurify"
import ReactDOMServer from "react-dom/server"
import { Text } from 'slate';
import { UnsafeElement } from "./Element"
import { UnsafeLeaf } from "./Leaf"
import { CustomEditor } from "./Types"

function serialize(editor: CustomEditor): string {
    const content = ReactDOMServer.renderToStaticMarkup(EditorContentBuilder({editor: editor})) 

    // It is not necessary to sanitize the content (because React has already done it).
    // But, it can only hurt performance, so lets do it anyway just to be safe.
    const cleanContent = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } })
    
    return cleanContent
}

// The functions walks down the entire editor content tree, and returns the tree as jsx 
function EditorContentBuilder( {editor}: {editor: CustomEditor} ) {
    const tree = editor.children.map( (element, index) => <SectionBuilder key={index} element={element} />)
    return <>{tree}</>
}

// Recursive functions that walks down all branches from a start element
// Returns the tree as jsx elements
function SectionBuilder( { element }: { element: any} ) {
    if(Text.isText(element)) {
        return <UnsafeLeaf children={element.text} leaf={element} />
    }

    const children = element.children.map( (child: any, index: number) => <SectionBuilder key={index} element={child}/>)
    return <UnsafeElement children={children} element={element}/>
}
