import { List, Theme, useMediaQuery } from "@mui/material";
import { UserGroup } from "common/enums";
import { hasGroupAccess } from "common/utils";
import { useMatch } from "react-router-dom";
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
import HistoryIcon from '@mui/icons-material/MenuBook';
import SheetArchiveIcon from '@mui/icons-material/MusicVideo';
import LyricIcon from '@mui/icons-material/Nightlife';
import MemberAddIcon from '@mui/icons-material/PersonAdd';
import PollIcon from '@mui/icons-material/Poll';
import FaqIcon from '@mui/icons-material/QuestionMark';

export function NavContent({onItemClick}: {onItemClick: VoidFunction}) {
    const auth = useAuth()
    return auth.user
        ? <PrivateNavContent onItemClick={onItemClick} />
        : <PublicNavContent onItemClick={onItemClick} />
}

function PublicNavContent({onItemClick}: {onItemClick: VoidFunction}) {
    const matchesFrontPage = !!useMatch("/framside/*")
    const isMobile = useMediaQuery( (theme: Theme) => theme.breakpoints.only("xs"))

    return (
        <List dense={isMobile}>
            <ListItemLink 
                text="Framside" 
                to="/" 
                onLinkClick={onItemClick} 
                icon={<HomeIcon/>} 
                activate={matchesFrontPage} />
            <ListItemLink 
                text="Bli Medlem" 
                to="/bli-medlem" 
                icon={<BecomeMemberIcon/>}
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="FAQ"
                to="/faq"
                icon={<FaqIcon/>}
                onLinkClick={onItemClick}
            />
            <ListItemDivider/>
            <ListItemLink 
                text="Traller" 
                to="/studenttraller" 
                icon={<LyricIcon/>} 
                onLinkClick={onItemClick}/>
            <ListItemDivider/>
            <ListItemLink 
                text="Dokumenter" 
                to="/dokumenter" 
                icon={<DocumentsIcon/>} 
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="Historie"
                to="/historie"
                icon={<HistoryIcon/>}
                onLinkClick={onItemClick}
            />
            <ListItemLink 
                text="Styrets Nettsider" 
                to="/styrets-nettsider" 
                icon={<BoardWebsiteListIcon/>}
                onLinkClick={onItemClick}/> 
            <ListItemLink 
                externalRoute 
                text="Wiki" 
                to="https://wiki.motstanden.no/" 
                icon={<WikiIcon/>} 
                onLinkClick={onItemClick}/>
            <ListItemDivider/>
            <ListItemLink 
                text="Lisens" 
                to="/lisens" 
                icon={<LicenseIcon/>} 
                onLinkClick={onItemClick}/>
        </List>
    )
}

function PrivateNavContent({onItemClick}: {onItemClick: VoidFunction}) {
    const { user } = useAuth();
    const isSuperAdmin = hasGroupAccess(user!, UserGroup.SuperAdministrator)
    
    const matchesFrontPage = !!useMatch("/hjem/*")
    const matchesWallPage = !!useMatch("/vegg/*")

    const isMobile = useMediaQuery( (theme: Theme) => theme.breakpoints.only("xs"))
    
    return (
        <List dense={isMobile} sx={{pb: "50px"}}>
            <ListItemLink 
                text="Hjem" 
                to="/" 
                activate={matchesFrontPage || matchesWallPage} 
                icon={<HomeIcon/>} 
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="Arrangement" 
                to="/arrangement" 
                icon={<EventIcon/>} 
                onLinkClick={onItemClick} 
                />
            <ListItemDivider/>
            <ListItemLink 
                text="Sitater" 
                to="/sitater" 
                icon={<QuotesIcon/>} 
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="Rykter" 
                to="/rykter" 
                icon={<RumourIcon/>} 
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="Avstemninger" 
                to="/avstemninger" 
                icon={<PollIcon/>} 
                onLinkClick={onItemClick} 
            />
            <ListItemDivider/>
            <ListItemLink 
                text="Noter" 
                to="/notearkiv" 
                icon={<SheetArchiveIcon/>} 
                onLinkClick={onItemClick} />
            <ListItemLink
                text="Traller" 
                to="/studenttraller" 
                icon={<LyricIcon/>} 
                onLinkClick={onItemClick}/>
            <ListItemDivider/>
            <ListItemLink 
                externalRoute 
                text="Wiki" 
                to="https://wiki.motstanden.no/" 
                icon={<WikiIcon/>} 
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="Dokumenter" 
                to="/dokumenter" 
                icon={<DocumentsIcon />} 
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="Styrets Nettsider" 
                to="/styrets-nettsider" 
                icon={<BoardWebsiteListIcon/>} 
                onLinkClick={onItemClick}/>
            <ListItemDivider/>

            {isSuperAdmin && (
                <ListItemExpander text="Medlem">
                    <ListItemLink 
                        text="Ny" 
                        to="/medlem/ny" 
                        icon={<MemberAddIcon/>} 
                        onLinkClick={onItemClick}/>
                    <ListItemLink 
                        text="Liste" 
                        to="/medlem/liste" 
                        icon={<MemberListIcon/>} 
                        onLinkClick={onItemClick}/>
                </ListItemExpander>
            )}

            {!isSuperAdmin && (
                <ListItemLink 
                    text="Medlemmer" 
                    to="/medlem/liste" 
                    icon={<MemberListIcon/>}
                    onLinkClick={onItemClick}/>
            )}

            <ListItemExpander text="Om oss">
                <ListItemLink 
                    text="Framside" 
                    to="/framside" 
                    icon={<FrontPageIcon/>} 
                    onLinkClick={onItemClick}/>
                <ListItemLink 
                    text="FAQ"
                    to="/faq"
                    icon={<FaqIcon/>}
                    onLinkClick={onItemClick}
                />
                <ListItemLink 
                    text="Historie"
                    to="/historie"
                    icon={<HistoryIcon/>}
                    onLinkClick={onItemClick}
                />
                <ListItemLink 
                    text="Bli Medlem" 
                    to="/bli-medlem" 
                    icon={<BecomeMemberIcon/>} 
                    onLinkClick={onItemClick}/>
                <ListItemLink 
                    text="Lisens" 
                    to="/lisens" 
                    icon={<LicenseIcon/>} 
                    onLinkClick={onItemClick}/>
            </ListItemExpander>
        </List>
    )
}
