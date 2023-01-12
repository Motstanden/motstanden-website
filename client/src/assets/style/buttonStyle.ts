import { SxProps, Theme } from "@mui/material";

export const iconButtonStaticStyle: SxProps<Theme> = {
    color: "#FFF",
    bgcolor: "rgba(45, 45, 45, 0.65)",
    "&:hover": {
        bgcolor: "rgba(75, 75, 75, 0.75)",
    }
}