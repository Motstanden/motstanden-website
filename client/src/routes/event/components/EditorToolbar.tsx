import React from 'react';
import { Editor, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import * as RichText from "src/components/TextEditor/FormattedText";

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import Divider from "@mui/material/Divider";
import Stack from '@mui/material/Stack';
import { SxProps } from "@mui/material/styles";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from "@mui/material/Tooltip";
import { ElementType, TextFormat } from "common/richTextSchema";


export function EditorToolbar() {

    return (
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
            <div>
                <TextFormatButtons />
            </div>
            <Divider flexItem orientation='vertical' sx={{ my: "4px", mx: "4px" }} />
            <div>
                <BlockElementButtons />
            </div>
        </Stack>
    );
}

const toggleButtonGroupStyle: SxProps = {
    '& .MuiToggleButtonGroup-grouped': {
        margin: "0px",
        border: 0,
        borderRadius: "0px",
        height: "35px",
        width: "35px"
    }
}

function TextFormatButtons() {
    const editor = useSlate()

    const onChange = (event: React.MouseEvent<HTMLElement>, newFormats: TextFormat[]) => {
        // Apply all new formats
        newFormats.forEach(format => RichText.setMark(editor, format, true))

        // Remove formats that does not exists in 'newFormats'
        Object.values(TextFormat)
            .filter(format => !newFormats.includes(format))
            .forEach(format => RichText.setMark(editor, format, false))

    }

    const buildValue = (value: TextFormat[], format: TextFormat): TextFormat[] => {
        if (RichText.isMarkActive(editor, format)) {
            return [...value, format]
        }
        return value
    }

    let values: TextFormat[] = []
    values = buildValue(values, TextFormat.Bold)
    values = buildValue(values, TextFormat.Italic)
    values = buildValue(values, TextFormat.Underline)

    return (
        <ToggleButtonGroup
            value={values}
            onChange={onChange}
            size="small"
            sx={toggleButtonGroupStyle}
        >
            <ToggleButton value={TextFormat.Bold} >
                <Tooltip title="Fet tekst (Ctrl+B)">
                    <FormatBoldIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value={TextFormat.Italic}>
                <Tooltip title="Kursiv tekst (Ctrl+I)">
                    <FormatItalicIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value={TextFormat.Underline}>
                <Tooltip title="Understreket tekst (Ctrl+U)">
                    <FormatUnderlinedIcon />
                </Tooltip>
            </ToggleButton>
        </ToggleButtonGroup>
    )
}

function BlockElementButtons() {
    const editor = useSlate()

    const isMatch = (type: ElementType): boolean => {
        const [match] = Editor.nodes(editor, {              
            match: (n: any) => n.type === type          // eslint-disable-line @typescript-eslint/no-explicit-any    
        })
        return !!match
    }

    const onChange = (event: React.MouseEvent<HTMLElement>, newType?: ElementType) => {
        Transforms.unwrapNodes(editor, {
            match: (n: any) => n.type === ElementType.BulletedList || n.type === ElementType.NumberedList,  // eslint-disable-line @typescript-eslint/no-explicit-any
            split: true
        })

        const isList = newType === ElementType.BulletedList || newType === ElementType.NumberedList
        newType ??= ElementType.Div
        Transforms.setNodes(
            editor,
            { type: isList ? ElementType.ListItem : newType },
            { match: n => Editor.isBlock(editor, n) }
        )
        if (isList) {
            Transforms.wrapNodes(editor, { type: newType, children: [] })
        }
    }

    let value: undefined | ElementType.H3 | ElementType.BulletedList | ElementType.NumberedList = undefined;
    value = isMatch(ElementType.H3) ? ElementType.H3 : value
    value = isMatch(ElementType.BulletedList) ? ElementType.BulletedList : value
    value = isMatch(ElementType.NumberedList) ? ElementType.NumberedList : value
    return (
        <ToggleButtonGroup
            exclusive
            value={value}
            onChange={onChange}
            size="small"
            sx={toggleButtonGroupStyle}
        >
            <ToggleButton value={ElementType.H3}>
                <Tooltip title="Liten overskrift">
                    <strong style={{ fontSize: "22px" }}>
                        H
                    </strong>
                </Tooltip>
            </ToggleButton>
            <ToggleButton value={ElementType.BulletedList}>
                <Tooltip title="Punktliste">
                    <FormatListBulletedIcon />
                </Tooltip>
            </ToggleButton>
            <ToggleButton value={ElementType.NumberedList}>
                <Tooltip title="Nummerert liste">
                    <FormatListNumberedIcon />
                </Tooltip>
            </ToggleButton>
        </ToggleButtonGroup>
    )
} 
