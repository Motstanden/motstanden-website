import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Link from '@mui/material/Link';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';



import { Collapse, Divider, FormControlLabel, FormGroup, Stack, Switch, SxProps } from '@mui/material';

import { useAuth } from '../routes/login/Authentication';
import { useRef, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ThemeNameType, useAppTheme } from './Themes';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function ResponsiveAppBar(){
    return (
        <AppBar position="static" >
            <Box display={{ xs: 'none', md: 'flex' }} >
                <DesktopToolbar/>
            </Box>
            <Box display={{ xs: 'flex', md: 'none' }} >
                <MobileToolBar/>
            </Box>
        </AppBar>
    );
};

function DesktopToolbar(){

    return ( 
        <Container>

            <Toolbar disableGutters>
                <Stack 
                    direction="row" 
                    alignItems="center" 
                    justifyContent="space-between" 
                    sx={{width: "100%"}}
                    >
                    <Stack 
                        direction="row"
                        alignItems="center"
                        spacing={6}>
                        <Title variant='h5'/>
                        <NavBar/>
                    </Stack>
                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        sx={{justifySelf: "flex-end"}} >
                        <ToggleThemeButton/>
                        <Divider 
                            light={false} 
                            orientation="vertical" 
                            flexItem
                            variant="middle"
                            sx={{
                                mr: 1,
                                ml: 2,
                                my: 1
                            }}
                            />
                        <LoginStatus/>  
                    </Stack>
                </Stack>
            </Toolbar>
        </Container>
    )
}

function NavBar(){
    let auth = useAuth()
    return auth.user ? <LoggedInNavBar/> : <LoggedOutNavBar/>
}

function LoggedInNavBar(){

    const linkStyle: SxProps = {                    
        color: 'inherit',
        mr: 2,
    }

    return (
        <nav>
            <Box sx={{display: "flex", alignItems: "center"}}>

                <Link component={RouterLink} to="/hjem" sx={linkStyle}>
                    Hjem
                </Link>
                <Link component={RouterLink} to="/notearkiv" sx={linkStyle}>
                    Notearkiv
                </Link>
                <Link component={RouterLink} to="/studenttraller" sx={linkStyle}>
                    Studenttraller
                </Link>
                <Link component={RouterLink} to="/dokumenter" sx={linkStyle}>
                    Dokumenter
                </Link>
                <AboutUsDropdown sx={{ ...linkStyle, mr: 0, ml: 0}}/>
            </Box>
        </nav>
    )
}

function LoggedOutNavBar(){

    const linkStyle: SxProps = {                    
        color: 'inherit',
        mr: 4,
    }


    return (
        <nav>
            <Box sx={{display: "flex", alignItems: "center"}}>
                <AboutUsDropdown sx={{ ...linkStyle, mr: 2}}/>
                <Link component={RouterLink} to="/studenttraller" sx={linkStyle}>
                    Studenttraller
                </Link>
                <Link component={RouterLink} to="/dokumenter" sx={linkStyle}>
                    Dokumenter
                </Link>
            </Box>
        </nav>
    )
}


function AboutUsDropdown( { sx }: { sx?: SxProps}){
    
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const aboutEl = useRef(null)

    return (
        <>
            <Button 
                ref={aboutEl}
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                sx={{
                    ...sx, 
                    textTransform: "none", 
                }} 
                >
                <Typography variant="subtitle1">
                    Om oss
                </Typography>
                {isAboutOpen ? <ExpandLess/> : <ExpandMore/>}
            </Button>
            <Menu 
                anchorEl={aboutEl.current}
                open={isAboutOpen}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                onClose={() => setIsAboutOpen(false)}
                >
                <List component="div" disablePadding sx={{minWidth: 200}}>
                    <ListItem button component={RouterLink} to="/" onClick={() => setIsAboutOpen(false)}>
                        <ListItemText primary="Framside" />
                    </ListItem>
                    <ListItem button component={RouterLink} to="/bli-medlem" onClick={() => setIsAboutOpen(false)}>
                        <ListItemText primary="Bli Medlem" />
                    </ListItem>
                    <ListItem button component={RouterLink} to="/faq" onClick={() => setIsAboutOpen(false)}>
                        <ListItemText primary="FAQ" />
                    </ListItem>
                    <ListItem button component="a" href="https://wiki.motstanden.no/" onClick={() => setIsAboutOpen(false)}>
                        <ListItemText primary="Wiki" />
                    </ListItem>
                </List>
            </Menu>
        </>
    )
}

function MobileToolBar() {
    return ( 
        <Container>
            <Toolbar  disableGutters sx={{display: "flex", justifyContent: "space-between"}}>
                <SideDrawer/>
                <Title variant='h6'/>
                <LoginStatus/>  
            </Toolbar>
        </Container>   
    )
}

function SideDrawer() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <IconButton
                size="small"
                color="inherit"
                onClick={() => setIsOpen(true)}
                >
                <MenuIcon />
            </IconButton>

            <SwipeableDrawer 
                anchor="left"
                open={isOpen}
                onClose={() => setIsOpen(false)}
                onOpen={() => setIsOpen(true)}
                disableSwipeToOpen={true}
                swipeAreaWidth={400}
                >
                    <SideDrawerContent onClick={() => setIsOpen(false)}/>
            </SwipeableDrawer>
        </>
    )
}

interface SideDrawerProps {
    onClick: VoidFunction
}

function SideDrawerContent(props: SideDrawerProps) {
    let auth = useAuth()
    return auth.user ? <LoggedInDrawerContent onClick={props.onClick}/> : <LoggedOutDrawerContent onClick={props.onClick}/>
}

function LoggedInDrawerContent(props: SideDrawerProps) {
    const [isAboutOpen, setIsAboutOpen] = useState(false)

    return (
        <List sx={{minWidth: 250}}>
            <ListItem>
                <ListItemText>Motstanden</ListItemText>
            </ListItem>
            <Divider light={false}/>

            <ListItem button component={RouterLink} to="/hjem" onClick={props.onClick}>
                <ListItemText>Hjem</ListItemText>
            </ListItem>

            <ListItem button component={RouterLink} to="/studenttraller" onClick={props.onClick}>
                <ListItemText>Studenttraller</ListItemText>
            </ListItem>
            
            <ListItem button component={RouterLink} to="/notearkiv" onClick={props.onClick}>
                <ListItemText>Notearkiv</ListItemText>
            </ListItem>

            <ListItem button component={RouterLink} to="/dokumenter" onClick={props.onClick}>
                <ListItemText>Dokumenter</ListItemText>
            </ListItem>

            <ListItem button component="a" href="https://wiki.motstanden.no/"  onClick={props.onClick}>
                <ListItemText primary="Wiki" />
            </ListItem>

            <ListItemButton onClick={() => setIsAboutOpen(!isAboutOpen)}>
                <ListItemText primary="Om oss"/>
                {isAboutOpen ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={isAboutOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button sx={{ pl: 4 }} component={RouterLink} to="/"  onClick={props.onClick} >
                        <ListItemText primary="Framside" />
                    </ListItem>
                    <ListItem button sx={{ pl: 4 }} component={RouterLink} to="/faq"  onClick={props.onClick} >
                        <ListItemText primary="FAQ" />
                    </ListItem>
                    <ListItem button sx={{ pl: 4 }} component={RouterLink} to="/bli-medlem"  onClick={props.onClick} >
                        <ListItemText primary="Bli Medlem" />
                    </ListItem>
                </List>
            </Collapse>

            <Divider light={false}/>
            <ListItem>
                <ListItemText>
                    <ToggleThemeButton/>
                </ListItemText>
            </ListItem>
            <Divider light={false}/>
        </List>
    )
}

function LoggedOutDrawerContent(props: SideDrawerProps) {

    const [isAboutOpen, setIsAboutOpen] = useState(true)
    return (
        <List sx={{minWidth: 230}}>
            <ListItem>
                <ListItemText>Motstanden</ListItemText>
            </ListItem>
            <Divider light={false}/>
 

            <ListItemButton onClick={() => setIsAboutOpen(!isAboutOpen)}>
                <ListItemText primary="Om oss"/>
                {isAboutOpen ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={isAboutOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button sx={{ pl: 4 }} component={RouterLink} to="/"  onClick={props.onClick} >
                        <ListItemText primary="Framside" />
                    </ListItem>
                    <ListItem button sx={{ pl: 4 }} component={RouterLink} to="/bli-medlem"  onClick={props.onClick} >
                        <ListItemText primary="Bli Medlem" />
                    </ListItem>
                    <ListItem button sx={{ pl: 4 }} component={RouterLink} to="/faq"  onClick={props.onClick} >
                        <ListItemText primary="FAQ" />
                    </ListItem>
                    <ListItem button sx={{ pl: 4 }} component="a" href="https://wiki.motstanden.no/"  onClick={props.onClick}>
                        <ListItemText primary="Wiki" />
                    </ListItem>
                </List>
            </Collapse>
            
            <ListItem button component={RouterLink} to="/studenttraller" onClick={props.onClick}>
                <ListItemText>Studenttraller</ListItemText>
            </ListItem>
            
            <ListItem button component={RouterLink} to="/dokumenter" onClick={props.onClick}>
                <ListItemText>Dokumenter</ListItemText>
            </ListItem>

            <Divider light={false}/>
            <ListItem>
                <ListItemText>
                    <ToggleThemeButton labelPlacement='end'/>
                </ListItemText>
            </ListItem>
            <Divider light={false}/>
        </List>
    )

}



type VariantType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption" | "button" | "overline" | "inherit" | undefined

interface TitleProps {
    variant: VariantType,
    sx?: SxProps | undefined
}

function Title(props: TitleProps) {
    let auth = useAuth()
	return (
        <Typography
            component={RouterLink}
            to={auth.user ? "/hjem" : "/"}
            noWrap
            variant={props.variant}
            sx={{
                fontFamily: 'monospace',
                py: 1,
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                ...props.sx
            }}
            >
            MOTSTANDEN
        </Typography>
	)
}

function LoginStatus(){
    let auth = useAuth()
    return  auth.user ? <UserAvatar/> : <LoginButton/>
}

function UserAvatar() {
    let auth = useAuth()
    let username = auth?.user ?? ""
    
    let navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSignOut = () => {
        auth.signOut( () => navigate("/") )
    }

    return (
        <>
        <Tooltip title={username}>
            <IconButton onClick={handleClick}>
                <Avatar alt={username}/>
            </IconButton>
        </Tooltip>
        <Menu 
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={onSignOut}>
                Logg ut
            </MenuItem>
        </Menu>
        </>
    )
}

function LoginButton(){
    return (
        <Link variant='body1'
            component={RouterLink} to="/logg-inn" 
            sx={{
                color: "inherit",
                fontWeight: 300,
                ml: 1
            }}
        >
            Logg inn
        </Link>
    )
}

interface ToggleThemeButtonProps {
    labelPlacement?: "top" | "bottom" | "start" | "end" 
    sx?: SxProps
}

function ToggleThemeButton(props: ToggleThemeButtonProps){

    let theme = useAppTheme()

    const onSwitchClick = () => {
        let newTheme: ThemeNameType = theme.name === "dark" ? "light" : "dark" 
        theme.changeTheme(newTheme)
    }

    return (
        <FormControlLabel 
            label="Skyggemodus"
            labelPlacement={props?.labelPlacement ?? "end"}
            control={<Switch checked={theme.name === "dark"}/>}
            sx={{mr: 0}}
            onClick={onSwitchClick}
            />
    )
}