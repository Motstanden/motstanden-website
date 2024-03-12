import { Theme, useMediaQuery } from "@mui/material";

export function useIsMobileScreen() {
    return useMediaQuery( (theme: Theme) => theme.breakpoints.only('xs'))
}