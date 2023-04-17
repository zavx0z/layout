import MuiDrawer from "@mui/material/Drawer"
import Toolbar from "@mui/material/Toolbar"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import * as React from "react"
import {useLocation, useNavigate} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {Slide} from "@mui/material"
import {styled} from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import {ChevronLeft, ChevronRight} from "@mui/icons-material"
import {isMobile} from "react-device-detect"
import Divider from "@mui/material/Divider"
import Collapse from "@mui/material/Collapse"

const drawerWidth = isMobile ? '100%' : 240

const openedMixin = theme => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
})

const closedMixin = theme => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(8)} + 1px)`,
})

const Drawer = styled(MuiDrawer, {shouldForwardProp: prop => prop !== 'open'})(({theme, open}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {...openedMixin(theme), '& .MuiDrawer-paper': openedMixin(theme)}),
    ...(!open && {...closedMixin(theme), '& .MuiDrawer-paper': closedMixin(theme)}),
}))

const DrawerMenu = ({open, setOpen, items, visibleCloseButton}) => {
    const handleDrawerToggle = () => setOpen(!open)
    const {t} = useTranslation('меню')
    const navigate = useNavigate()
    const location = useLocation()
    return <Drawer variant="permanent" open={open}>
        <Toolbar/>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}>
            {items.map((item, idx) =>
                <Box key={idx}>
                    <List sx={{pb: 0, pt: 0}}>
                        {item.map(({title, subtitle, route, Icon}, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    sx={theme => ({
                                        minHeight: theme.spacing(7),
                                        p: 0,
                                        justifyItems: 'flex-start'
                                    })}
                                    selected={location.pathname.includes(route)}
                                    onClick={() => navigate(route)}
                                >
                                    <Box sx={theme => ({
                                        minWidth: theme.spacing(8),
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    })}>
                                        <Icon sx={{color: 'primary.light'}}/>
                                        <Collapse in={!open} mountOnEnter unmountOnExit orientation={'vertical'} duration={100}>
                                            <Typography noWrap sx={{fontSize: '0.6rem'}}>
                                                {t(title)}
                                            </Typography>
                                        </Collapse>
                                    </Box>
                                    <Slide in={open} mountOnEnter unmountOnExit direction={'left'}>
                                        <ListItemText
                                            primary={t(title)}
                                            primaryTypographyProps={{color: 'primary'}}
                                            secondary={t(subtitle)}
                                            secondaryTypographyProps={{variant: 'caption', sx: {mt: -.2}}}
                                        />
                                    </Slide>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    {items.length > 1 && <Divider sx={theme => ({backgroundColor: theme.palette.primary.light})}/>}
                </Box>
            )}
        </Box>
        {visibleCloseButton &&
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                <Box sx={theme => ({display: 'flex', justifyContent: 'center', minWidth: theme.spacing(8), pb: theme.spacing(1)})}>
                    <IconButton onClick={handleDrawerToggle}>
                        {open ? <ChevronLeft/> : <ChevronRight/>}
                    </IconButton>
                </Box>
            </Box>}
    </Drawer>
}
export default DrawerMenu