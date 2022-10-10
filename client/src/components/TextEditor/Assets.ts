import { ElementType } from "common/richTextSchema";
import { Descendant } from "slate";

export const emptyRichText: Descendant[] = [
    {
        type: ElementType.Div,
        children: [{ text: "" }]
    }
]