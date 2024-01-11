
import { Link } from "@mui/material";
import DOMPurify from "dompurify";
import Linkify from 'linkify-react';

export function LinkifiedText({ children }: {children: string}) {
    return (
        <Linkify options={{render: RenderLink}} >
            {DOMPurify.sanitize(children)}
        </Linkify>
    );
}

function RenderLink({ attributes, content }: { [attributes: string]: any, content: string }) {
    return (
        <Link 
            href={attributes.href} 
            color="secondary"
            underline="hover"
            >
            {content}
        </Link>   
    )
}
