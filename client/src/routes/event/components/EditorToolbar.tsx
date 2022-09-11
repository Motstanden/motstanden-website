import React from 'react';
import { Transforms } from 'slate';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import * as RichText from "src/components/TextEditor/FormattedText"

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ElementType, FormattedText, TextFormat } from 'src/components/TextEditor/Types';
import Stack from '@mui/material/Stack';


export function EditorToolbar() {

    return (
        <Stack spacing={2} direction="row" alignItems="center">
            <TextFormatButtons />
            <BlockElementButtons />
        </Stack>
    );
}

function TextFormatButtons() {
    const editor = useSlate()

    const onChange = ( event: React.MouseEvent<HTMLElement>, newFormats: TextFormat[]) => {
        // Apply all new formats
        newFormats.forEach( format => RichText.setMark(editor, format, true))

        // Remove formats that does not exists in 'newFormats'
        Object.values(TextFormat)
                .filter( format => !newFormats.includes(format))
                .forEach( format => RichText.setMark(editor, format, false))

    }

    const buildValue = (value: TextFormat[], format: TextFormat): TextFormat[] => {
        if(RichText.isMarkActive(editor, format)) {
            return [...value, format]
        }
        return value
    }

    let values: TextFormat[] = []
    values = buildValue(values, TextFormat.Bold)
    values = buildValue(values, TextFormat.Italic)
    values = buildValue(values, TextFormat.Underline)

    return (
        <ToggleButtonGroup value={values} onChange={onChange}>
            <ToggleButton value={TextFormat.Bold} >
                <FormatBoldIcon/>
            </ToggleButton>
            <ToggleButton value={TextFormat.Italic}>
                <FormatItalicIcon/>
            </ToggleButton>
            <ToggleButton value={TextFormat.Underline}>
                <FormatUnderlinedIcon/>
            </ToggleButton>
        </ToggleButtonGroup>
    )
}
    
    
function BlockElementButtons() {
    const editor = useSlate()

    const isMatch = ( type: ElementType ): boolean => {
        const [match]: any = Editor.nodes(editor, {
            match: (n: any) => n.type === type
        })
        return !!match
    }

    const onChange = ( event: React.MouseEvent<HTMLElement>, newType: ElementType) => {
        console.log(newType)

        Transforms.unwrapNodes(editor, {
            match: (n: any) => n.type === ElementType.BulletedList || n.type === ElementType.NumberedList,
            split: true
        })

        const isList = newType === ElementType.BulletedList || newType === ElementType.NumberedList
        Transforms.setNodes(
            editor,
            { type: isList ? ElementType.ListItem : newType },
            { match: n => Editor.isBlock(editor, n)}
        )
        if(isList) {
            Transforms.wrapNodes(editor, { type: newType, children: [] })
        }
    }

    let value = undefined;
    value = isMatch(ElementType.H2) ? ElementType.H2 : value
    value = isMatch(ElementType.H3) ? ElementType.H3 : value
    value = isMatch(ElementType.BulletedList) ? ElementType.BulletedList : value
    value = isMatch(ElementType.NumberedList) ? ElementType.NumberedList : value
    console.log(value)
    return (
        <ToggleButtonGroup 
            exclusive
            value={value}
            onChange={onChange}
            >
            <ToggleButton value={ElementType.H2} >
                <strong>
                    H1
                </strong>
            </ToggleButton>
            <ToggleButton value={ElementType.H3}>
                <strong>
                    H2
                </strong>
            </ToggleButton>
            <ToggleButton value={ElementType.BulletedList}>
                <FormatListBulletedIcon/>
            </ToggleButton>
            <ToggleButton value={ElementType.NumberedList}>
                <FormatListNumberedIcon/>
            </ToggleButton>
        </ToggleButtonGroup>
    )
} 
