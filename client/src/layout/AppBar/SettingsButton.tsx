import SettingsIcon from '@mui/icons-material/Settings';
import { ToolbarButton } from './ToolbarButton';

export function SettingsButton({
    onClick,
}: {
    onClick?: VoidFunction
}) {
    return (
        <ToolbarButton 
            onClick={onClick}
            tooltip='Innstillinger'
        >
            <SettingsIcon 
                fontSize="medium"
                sx={{
                    color: "primary.contrastText",
                }}/>
        </ToolbarButton>
    )
}