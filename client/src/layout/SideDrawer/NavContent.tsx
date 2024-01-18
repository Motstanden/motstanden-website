import { List } from "@mui/material";
import { UserGroup } from "common/enums";
import { hasGroupAccess } from "common/utils";
import { useAuth } from "src/context/Authentication";
import * as MenuIcons from 'src/layout/appBar/MenuIcons';
import { ListItemDivider, ListItemExpander, ListItemLink } from './ListItem';


export function NavContent({onItemClick}: {onItemClick: VoidFunction}) {
    const auth = useAuth()
    return auth.user
        ? <PrivateNavContent onItemClick={onItemClick} />
        : <PublicNavContent onItemClick={onItemClick} />
}

function PublicNavContent({onItemClick}: {onItemClick: VoidFunction}) {
    return (
        <List>
            <ListItemLink text="Framside" to="/" onLinkClick={onItemClick} icon={<MenuIcons.Home />} />
            <ListItemLink text="Bli Medlem" to="/bli-medlem" onLinkClick={onItemClick} icon={<MenuIcons.BecomeMember />} />
            <ListItemDivider/>
            <ListItemLink text="Traller" to="/studenttraller" onLinkClick={onItemClick} icon={<MenuIcons.Lyric />} />
            <ListItemDivider/>
            <ListItemLink text="Dokumenter" to="/dokumenter" onLinkClick={onItemClick} icon={<MenuIcons.Documents />} />
            <ListItemLink text="Styrets Nettsider" to="/styrets-nettsider" onLinkClick={onItemClick} icon={<MenuIcons.BoardWebsiteList/>} />
            <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/" onLinkClick={onItemClick} icon={<MenuIcons.Wiki />} />
            <ListItemDivider/>
            <ListItemLink text="Lisens" to="/lisens" onLinkClick={onItemClick} icon={<MenuIcons.License />} />
        </List>
    )
}

function PrivateNavContent({onItemClick}: {onItemClick: VoidFunction}) {
    const { user } = useAuth();
    const isSuperAdmin = hasGroupAccess(user!, UserGroup.SuperAdministrator)

    return (
        <List>
            <ListItemLink text="Hjem" to="/hjem" onLinkClick={onItemClick} icon={<MenuIcons.Home />} />
            <ListItemLink text="Arrangement" to="/Arrangement" onLinkClick={onItemClick} icon={<MenuIcons.Event />} />
            <ListItemDivider/>
            <ListItemLink text="Sitater" to="/sitater" onLinkClick={onItemClick} icon={<MenuIcons.Quotes />} />
            <ListItemLink text="Rykter" to="/rykter" onLinkClick={onItemClick} icon={<MenuIcons.Rumour />} />
            <ListItemLink text="Avstemninger" to="/avstemninger" onLinkClick={onItemClick} icon={<MenuIcons.Poll />} />
            <ListItemDivider/>
            <ListItemLink text="Noter" to="/notearkiv" onLinkClick={onItemClick} icon={<MenuIcons.SheetArchive />} />
            <ListItemLink text="Traller" to="/studenttraller" onLinkClick={onItemClick} icon={<MenuIcons.Lyric />} />
            <ListItemDivider/>
            <ListItemLink externalRoute text="Wiki" to="https://wiki.motstanden.no/" onLinkClick={onItemClick} icon={<MenuIcons.Wiki />} />
            <ListItemLink text="Dokumenter" to="/dokumenter" onLinkClick={onItemClick} icon={<MenuIcons.Documents />} />
            <ListItemLink text="Styrets Nettsider" to="/styrets-nettsider" onLinkClick={onItemClick} icon={<MenuIcons.BoardWebsiteList/>} />
            <ListItemDivider/>

            {isSuperAdmin && (
                <ListItemExpander text="Medlem">
                    <ListItemLink text="Ny" to="/medlem/ny" onLinkClick={onItemClick} icon={<MenuIcons.MemberAdd />} />
                    <ListItemLink text="Liste" to="/medlem/liste" onLinkClick={onItemClick} icon={<MenuIcons.MemberList />} />
                </ListItemExpander>
            )}

            {!isSuperAdmin && (
                <ListItemLink text="Medlemmer" to="/medlem/liste" onLinkClick={onItemClick} icon={<MenuIcons.MemberList />}/>
            )}

            <ListItemExpander text="Om oss">
                <ListItemLink text="Framside" to="/framside" onLinkClick={onItemClick} icon={<MenuIcons.FrontPage />} />
                <ListItemLink text="Bli Medlem" to="/bli-medlem" onLinkClick={onItemClick} icon={<MenuIcons.BecomeMember />} />
                <ListItemLink text="Lisens" to="/lisens" onLinkClick={onItemClick} icon={<MenuIcons.License />} />
            </ListItemExpander>
        </List>
    )
}
