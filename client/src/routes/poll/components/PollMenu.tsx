import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { UserGroup } from 'common/enums';
import { Poll } from 'common/interfaces';
import { hasGroupAccess } from 'common/utils';
import React from "react";
import { CopyLinkMenuItem } from 'src/components/menu/CopyLinkMenuItem';
import { DeleteMenuItem } from 'src/components/menu/DeleteMenuItem';
import { IconPopupMenu } from 'src/components/menu/IconPopupMenu';
import { useAuthenticatedUser } from 'src/context/Authentication';

export function PollMenu({
    onDeleteClick,
    poll,
    onMenuOpen,
    onMenuClose,
}: {
    onDeleteClick: React.MouseEventHandler<HTMLLIElement>,
    poll: Poll,
    onMenuOpen?: VoidFunction,
    onMenuClose?: VoidFunction,
}) {
    const { user } = useAuthenticatedUser();
    const canDeletePoll = user.id === poll.createdBy || hasGroupAccess(user, UserGroup.Administrator);

    const url = `${window.location.origin}/avstemninger/${poll.id}`;
    return (
        <IconPopupMenu 
            icon={<MoreHorizIcon />} 
            ariaLabel='Avstemningmeny'
            onMenuOpen={onMenuOpen}
            onMenuClose={onMenuClose}
            >
            <CopyLinkMenuItem linkValue={url} divider={canDeletePoll}/>
            {canDeletePoll && ( 
                <DeleteMenuItem onClick={onDeleteClick} />
            )}
        </IconPopupMenu>
    );
}