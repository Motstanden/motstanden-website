import LoginIcon from '@mui/icons-material/Login';
import { IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAppBarIconSize } from '../useAppSizes';

export function LoginButton() {
    const { buttonSize, iconFontSize } = useAppBarIconSize();
    return (
        <IconButton
            component={RouterLink}
            to="/logg-inn"
            sx={{
                width: buttonSize,
                height: buttonSize,
                p: "0px",
                color: "inherit",
                bgcolor: "#FFFFFF15",
                ":hover": {
                    bgcolor: "#FFFFFF30",
                }
            }}
        >
            <LoginIcon
                fontSize={iconFontSize}
                sx={{
                    marginRight: "2px"
                }} />
        </IconButton>
    );
}
