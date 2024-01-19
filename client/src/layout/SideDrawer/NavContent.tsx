import { List } from "@mui/material";
import { UserGroup } from "common/enums";
import { hasGroupAccess } from "common/utils";
import { useAuth } from "src/context/Authentication";
import { ListItemDivider, ListItemExpander, ListItemLink } from './ListItem';

// Icons. See https://mui.com/components/material-icons/ for more icons
// The icons are renamed to be more semantic.
import BoardWebsiteListIcon from '@mui/icons-material/Code';
import DocumentsIcon from '@mui/icons-material/Description';
import BecomeMemberIcon from '@mui/icons-material/EmojiPeople';
import EventIcon from '@mui/icons-material/EventNote';
import QuotesIcon from '@mui/icons-material/FormatQuote';
import RumourIcon from '@mui/icons-material/Forum';
import MemberListIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import FrontPageIcon from '@mui/icons-material/Info';
import WikiIcon from '@mui/icons-material/Language';
import LicenseIcon from '@mui/icons-material/LocalPolice';
import SheetArchiveIcon from '@mui/icons-material/MusicVideo';
import LyricIcon from '@mui/icons-material/Nightlife';
import MemberAddIcon from '@mui/icons-material/PersonAdd';
import PollIcon from '@mui/icons-material/Poll';
import { useMatch } from "react-router-dom";

export function NavContent({onItemClick}: {onItemClick: VoidFunction}) {
    const auth = useAuth()
    return auth.user
        ? <PrivateNavContent onItemClick={onItemClick} />
        : <PublicNavContent onItemClick={onItemClick} />
}

function PublicNavContent({onItemClick}: {onItemClick: VoidFunction}) {
    const matchesFrontPage = !!useMatch("/framside/*")
    return (
        <List>
            <ListItemLink text="Framside" to="/" onLinkClick={onItemClick} icon={<HomeIcon/>} activate={matchesFrontPage} />
            <ListItemLink text="Bli Medlem" to="/bli-medlem" onLinkClick={onItemClick} icon={<BecomeMemberIcon/>} />
            <ListItemDivider/>
            <ListItemLink text="Traller" to="/studenttraller" onLinkClick={onItemClick} icon={<LyricIcon/>} />
            <ListItemDivider/>
            <ListItemLink text="Dokumenter" to="/dokumenter" onLinkClick={onItemClick} icon={<DocumentsIcon/>} />
            <ListItemLink text="Styrets Nettsider" to="/styrets-nettsider" onLinkClick={onItemClick} icon={<BoardWebsiteListIcon/>} />
            <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/" onLinkClick={onItemClick} icon={<WikiIcon/>} />
            <ListItemDivider/>
            <ListItemLink text="Lisens" to="/lisens" onLinkClick={onItemClick} icon={<LicenseIcon/>} />
        </List>
    )
}

function PrivateNavContent({onItemClick}: {onItemClick: VoidFunction}) {
    const { user } = useAuth();
    const matchesFrontPage = !!useMatch("/hjem/*")
    const matchesWallPage = !!useMatch("/vegg/*")
    const isSuperAdmin = hasGroupAccess(user!, UserGroup.SuperAdministrator)

    return (
        <List>
            <ListItemLink text="Hjem" to="/" onLinkClick={onItemClick} icon={<HomeIcon/>} activate={matchesFrontPage || matchesWallPage} />
            <ListItemLink text="Arrangement" to="/arrangement" onLinkClick={onItemClick} icon={<EventIcon/>} />
            <ListItemDivider/>
            <ListItemLink text="Sitater" to="/sitater" onLinkClick={onItemClick} icon={<QuotesIcon/>} />
            <ListItemLink text="Rykter" to="/rykter" onLinkClick={onItemClick} icon={<RumourIcon/>} />
            <ListItemLink text="Avstemninger" to="/avstemninger" onLinkClick={onItemClick} icon={<PollIcon/>} />
            <ListItemDivider/>
            <ListItemLink text="Noter" to="/notearkiv" onLinkClick={onItemClick} icon={<SheetArchiveIcon/>} />
            <ListItemLink text="Traller" to="/studenttraller" onLinkClick={onItemClick} icon={<LyricIcon/>} />
            <ListItemDivider/>
            <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/" onLinkClick={onItemClick} icon={<WikiIcon/>} />
            <ListItemLink text="Dokumenter" to="/dokumenter" onLinkClick={onItemClick} icon={<DocumentsIcon />} />
            <ListItemLink text="Styrets Nettsider" to="/styrets-nettsider" onLinkClick={onItemClick} icon={<BoardWebsiteListIcon/>} />
            <ListItemDivider/>

            {isSuperAdmin && (
                <ListItemExpander text="Medlem">
                    <ListItemLink text="Ny" to="/medlem/ny" onLinkClick={onItemClick} icon={<MemberAddIcon/>} />
                    <ListItemLink text="Liste" to="/medlem/liste" onLinkClick={onItemClick} icon={<MemberListIcon/>} />
                </ListItemExpander>
            )}

            {!isSuperAdmin && (
                <ListItemLink text="Medlemmer" to="/medlem/liste" onLinkClick={onItemClick} icon={<MemberListIcon/>}/>
            )}

            <ListItemExpander text="Om oss">
                <ListItemLink text="Framside" to="/framside" onLinkClick={onItemClick} icon={<FrontPageIcon/>} />
                <ListItemLink text="Bli Medlem" to="/bli-medlem" onLinkClick={onItemClick} icon={<BecomeMemberIcon/>} />
                <ListItemLink text="Lisens" to="/lisens" onLinkClick={onItemClick} icon={<LicenseIcon/>} />
            </ListItemExpander>
        </List>
    )
}
