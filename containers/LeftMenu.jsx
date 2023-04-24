import Drawer from "@mui/material/Drawer"
import Toolbar from "@mui/material/Toolbar"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import * as React from "react"
import {useState} from "react"
import {useLoaderData, useLocation, useNavigate} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {Fade, Slide} from "@mui/material"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import {ChevronLeft, ChevronRight} from "@mui/icons-material"
import Divider from "@mui/material/Divider"
import Collapse from "@mui/material/Collapse"
import {pwaStore} from "../../../index"


const LeftMenu = ({opened, items, visibleCloseButton, width = 240}) => {
    const [open, setOpen] = useState(Boolean(opened))
    const drawerWidth = width
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
    const handleDrawerToggle = () => setOpen(!open)
    const {t} = useTranslation('меню')
    const navigate = useNavigate()
    const location = useLocation()

    return <Fade in={true}>
        <Drawer
            id={'leftPanel'}
            variant="permanent"
            sx={theme => ({
                width: drawerWidth,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                ...(open && {...openedMixin(theme), '& .MuiDrawer-paper': openedMixin(theme)}),
                ...(!open && {...closedMixin(theme), '& .MuiDrawer-paper': closedMixin(theme)}),
            })}
        >
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
                                    <Slide
                                        in={open}
                                        // mountOnEnter
                                        // unmountOnExit
                                        direction={'left'}
                                    >
                                        <Box>
                                            <ListItemText
                                                primary={t(title)}
                                                primaryTypographyProps={{color: 'primary'}}
                                                secondary={t(subtitle)}
                                                secondaryTypographyProps={{variant: 'caption', sx: {mt: -.2}}}
                                            />
                                        </Box>
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
                <Box sx={theme => ({display: 'flex', justifyContent: 'center', minWidth: theme.spacing(8),})}>
                    <IconButton onClick={handleDrawerToggle}>
                        {open ? <ChevronLeft/> : <ChevronRight/>}
                    </IconButton>
                </Box>
            </Box>}
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
        }}>
            <Typography
                onClick={pwaStore.updateVersion}
                variant={'caption'}
                sx={{fontSize: '0.6rem'}}
            >
                V{process.env.REACT_APP_VERSION}
            </Typography>
        </Box>
        </Drawer>
    </Fade>
}
export default LeftMenu