import React, { useState } from 'react';

// Material UI
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { SxProps } from '@mui/system';

import { LabelPlacementType } from '../../tsTypes/MaterialUiTypes';
import { ThemeName, useAppTheme } from '../../context/Themes';




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
