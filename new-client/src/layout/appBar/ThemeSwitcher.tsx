import React, { useState } from 'react';

import { SxProps } from '@mui/system';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { LabelPlacementType } from '../../tsTypes/MaterialUiTypes';
import { useAppTheme, ThemeName } from '../../contextProviders/Themes';

interface ThemeSwitcherProps {
    labelPlacement?: LabelPlacementType
    sx?: SxProps
}

export default function ThemeSwitcher(props: ThemeSwitcherProps) {
    let theme = useAppTheme()

    const onSwitchClick = () => {
        let newTheme = theme.name === ThemeName.Dark ? ThemeName.Light : ThemeName.Dark 
        theme.changeTheme(newTheme)
    }

    return (
        <FormControlLabel 
            label="Skyggemodus"
            labelPlacement={props?.labelPlacement ?? "end"}
            control={<Switch checked={theme.name === ThemeName.Dark}/>}
            sx={{mr: 0}}
            onClick={onSwitchClick}
            />
    )
}
