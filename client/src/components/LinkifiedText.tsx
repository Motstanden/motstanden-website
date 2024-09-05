
import { Link } from "@mui/material";
import Linkify from 'linkify-react';

export function LinkifiedText({ children }: {children: string}) {
    return (
        <Linkify options={{render: RenderLink}} >
            {children}
        </Linkify>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RenderLink({ attributes, content }: { [attributes: string]: any, content: string }) {
    return (
        <Link 
            href={attributes.href} 
            color="secondary"
            underline="hover"
            sx={{
                wordBreak: "break-word",
            }}
            >
            {content}
        </Link>   
    )
}
