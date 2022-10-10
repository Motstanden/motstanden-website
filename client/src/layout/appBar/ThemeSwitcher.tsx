
// Material UI
import Switch from '@mui/material/Switch';
import { SxProps } from '@mui/system';

import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightSharpIcon from '@mui/icons-material/ModeNightSharp';
import { ThemeName, useAppTheme } from '../../context/Themes';
import { LabelPlacementType } from '../../utils/tsTypes/MaterialUiTypes';

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
        <Switch
            checked={theme.name === ThemeName.Dark}
            style={{ height: "38px", width: "38px" }}
            color="secondary"
            icon={<LightModeIcon fontSize="large" sx={{ color: "#f9c800" }} />}
            checkedIcon={<ModeNightSharpIcon fontSize='large' />}
            onClick={onSwitchClick}
        />
    )
}
