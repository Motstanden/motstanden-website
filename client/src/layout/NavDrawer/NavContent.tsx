import { List, Theme, useMediaQuery } from "@mui/material"
import { useMatch } from "react-router-dom"
import { usePotentialUser } from "src/context/Authentication"
import { ListItemExpander, ListItemHeader, ListItemLink } from './ListItem'

// Icons. See https://mui.com/components/material-icons/ for more icons
// The icons are renamed to be more semantic.
import BoardWebsiteListIcon from '@mui/icons-material/Code'
import DocumentsIcon from '@mui/icons-material/Description'
import BecomeMemberIcon from '@mui/icons-material/EmojiPeople'
import EventIcon from '@mui/icons-material/EventNote'
import QuotesIcon from '@mui/icons-material/FormatQuote'
import RumourIcon from '@mui/icons-material/Forum'
import UserTrashIcon from '@mui/icons-material/GroupRemove'
import UserListIcon from '@mui/icons-material/Groups'
import HomeIcon from '@mui/icons-material/Home'
import FrontPageIcon from '@mui/icons-material/Info'
import WikiIcon from '@mui/icons-material/Language'
import LicenseIcon from '@mui/icons-material/LocalPolice'
import HistoryIcon from '@mui/icons-material/MenuBook'
import SheetArchiveIcon from '@mui/icons-material/MusicVideo'
import LyricIcon from '@mui/icons-material/Nightlife'
import UserAddIcon from '@mui/icons-material/PersonAddAlt1'
import PollIcon from '@mui/icons-material/Poll'
import FaqIcon from '@mui/icons-material/QuestionMark'

import { strToNumber } from "common/utils"

export function NavContent({onItemClick}: {onItemClick: VoidFunction}) {
    const { isLoggedIn } = usePotentialUser()
    return isLoggedIn
        ? <PrivateNavContent onItemClick={onItemClick} />
        : <PublicNavContent onItemClick={onItemClick} />
}

function PublicNavContent({onItemClick}: {onItemClick: VoidFunction}) {
    const matchesFrontPage = !!useMatch("/framside/*")
    const isMobile = useMediaQuery( (theme: Theme) => theme.breakpoints.only("xs"))
    const iconSize = isMobile ? "small" : "medium"

    return (
        <List dense={isMobile}>
            <ListItemLink 
                text="Framside" 
                to="/" 
                onLinkClick={onItemClick} 
                icon={<HomeIcon fontSize={iconSize}/>} 
                activate={matchesFrontPage} />
            <ListItemLink 
                text="Bli Medlem" 
                to="/bli-medlem" 
                icon={<BecomeMemberIcon fontSize={iconSize}/>}
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="FAQ"
                to="/faq"
                icon={<FaqIcon fontSize={iconSize}/>}
                onLinkClick={onItemClick}
            />

            <ListItemHeader title="Resurser"/>
            <ListItemLink 
                text="Traller" 
                to="/studenttraller/populaere" 
                matchPattern="/studenttraller/*"
                icon={<LyricIcon fontSize={iconSize}/>} 
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="Dokumenter" 
                to="/dokumenter" 
                icon={<DocumentsIcon fontSize={iconSize}/>} 
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="Historie"
                to="/historie"
                icon={<HistoryIcon fontSize={iconSize}/>}
                onLinkClick={onItemClick}
            />

            <ListItemHeader title="Eksternt"/>
            <ListItemLink 
                text="Styrets Nettsider" 
                to="/styrets-nettsider" 
                icon={<BoardWebsiteListIcon fontSize={iconSize}/>}
                onLinkClick={onItemClick}/> 
            <ListItemLink 
                externalRoute 
                text="Wiki" 
                to="https://wiki.motstanden.no/" 
                icon={<WikiIcon fontSize={iconSize}/>} 
                onLinkClick={onItemClick}/>
            
            <ListItemHeader title="Annet"/>
            <ListItemLink 
                text="Lisens" 
                to="/lisens" 
                icon={<LicenseIcon fontSize={iconSize}/>} 
                onLinkClick={onItemClick}/>
        </List>
    )
}

function PrivateNavContent({onItemClick}: {onItemClick: VoidFunction}) {
    const { isSuperAdmin } = usePotentialUser();
    
    const matchesFrontPage = !!useMatch("/hjem/*")
    const matchesWallPage = !!useMatch("/vegg/*")

    const userPageMatch = useMatch("/brukere/:id/*")
    const matchesUserPage = userPageMatch !== null && !!strToNumber(userPageMatch.params.id)  

    const isMobile = useMediaQuery( (theme: Theme) => theme.breakpoints.only("xs"))
    const iconSize = isMobile ? "small" : "medium"
    return (
        <List dense={isMobile} sx={{pb: "50px"}}>
            <ListItemLink 
                text="Hjem" 
                to="/" 
                activate={matchesFrontPage || matchesWallPage} 
                icon={<HomeIcon fontSize={iconSize}/>} 
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="Arrangement" 
                to="/arrangement/kommende"
                matchPattern="/arrangement/*" 
                icon={<EventIcon fontSize={iconSize}/>} 
                onLinkClick={onItemClick} 
                />
            <ListItemLink 
                text="Sitater" 
                to="/sitater" 
                icon={<QuotesIcon fontSize={iconSize}/>} 
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="Rykter" 
                to="/rykter" 
                icon={<RumourIcon fontSize={iconSize}/>} 
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="Avstemninger" 
                to="/avstemninger/paagaaende" 
                matchPattern="/avstemninger/*"
                icon={<PollIcon fontSize={iconSize}/>} 
                onLinkClick={onItemClick} 
            />
            <ListItemHeader title="Musikk"/>
            <ListItemLink 
                text="Noter" 
                to="/notearkiv/repertoar" 
                matchPattern="/notearkiv/*"
                icon={<SheetArchiveIcon fontSize={iconSize}/>} 
                onLinkClick={onItemClick} />
            <ListItemLink
                text="Traller" 
                to="/studenttraller/populaere" 
                matchPattern="/studenttraller/*"
                icon={<LyricIcon fontSize={iconSize}/>} 
                onLinkClick={onItemClick}/>

            <ListItemHeader title="Resurser" />
            <ListItemLink 
                text="Dokumenter" 
                to="/dokumenter" 
                icon={<DocumentsIcon fontSize={iconSize} />} 
                onLinkClick={onItemClick}/>

            {isSuperAdmin && (
                <ListItemExpander text="Brukere" dense={isMobile} iconFontSize={iconSize}>
                    <ListItemLink 
                        text="Alle brukere" 
                        to="/brukere" 
                        activate={matchesUserPage}
                        matchPattern="/brukere"
                        icon={<UserListIcon fontSize={iconSize}/>} 
                        onLinkClick={onItemClick}/>
                    <ListItemLink 
                        text="Ny bruker" 
                        to="/brukere/ny" 
                        icon={<UserAddIcon fontSize={iconSize}/>} 
                        onLinkClick={onItemClick}/>
                    <ListItemLink 
                        text="Søppelbøtte"
                        to="/brukere/deaktiverte"
                        icon={<UserTrashIcon fontSize={iconSize}/>}
                        onLinkClick={onItemClick}
                    />
                </ListItemExpander>
            )}

            {!isSuperAdmin && (
                <ListItemLink 
                text="Medlemmer" 
                to="/brukere" 
                matchPattern="/brukere/*"
                icon={<UserListIcon fontSize={iconSize}/>}
                onLinkClick={onItemClick}/>
            )}

            <ListItemHeader title="Eksternt"/>
            <ListItemLink 
                externalRoute 
                text="Wiki" 
                to="https://wiki.motstanden.no/" 
                icon={<WikiIcon fontSize={iconSize}/>} 
                onLinkClick={onItemClick}/>
            <ListItemLink 
                text="Styrets Nettsider" 
                to="/styrets-nettsider" 
                icon={<BoardWebsiteListIcon fontSize={iconSize}/>} 
                onLinkClick={onItemClick}/>

                
            <ListItemHeader title="Annet"/>
            <ListItemExpander text="Om oss" dense={isMobile} iconFontSize={iconSize}>
                <ListItemLink 
                    text="Framside" 
                    to="/framside" 
                    icon={<FrontPageIcon fontSize={iconSize}/>} 
                    onLinkClick={onItemClick}/>
                <ListItemLink 
                    text="FAQ"
                    to="/faq"
                    icon={<FaqIcon fontSize={iconSize}/>}
                    onLinkClick={onItemClick}
                />
                <ListItemLink 
                    text="Historie"
                    to="/historie"
                    icon={<HistoryIcon fontSize={iconSize}/>}
                    onLinkClick={onItemClick}
                />
                <ListItemLink 
                    text="Bli Medlem" 
                    to="/bli-medlem" 
                    icon={<BecomeMemberIcon fontSize={iconSize}/>} 
                    onLinkClick={onItemClick}/>
                <ListItemLink 
                    text="Lisens" 
                    to="/lisens" 
                    icon={<LicenseIcon fontSize={iconSize}/>} 
                    onLinkClick={onItemClick}/>
            </ListItemExpander>
        </List>
    )
}
