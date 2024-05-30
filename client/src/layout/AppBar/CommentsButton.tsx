import ForumIcon from '@mui/icons-material/Forum';
import { ToolbarButton } from './ToolbarButton';

export function CommentsButton() {
    return(
        <ToolbarButton 
            tooltip='Kommentarer'
        >
            <ForumIcon 
                fontSize="small"
                sx={{
                    color: "primary.contrastText",
                }}/>
        </ToolbarButton>
    )
}