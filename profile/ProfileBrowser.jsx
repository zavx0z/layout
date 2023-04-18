import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"
import * as React from "react"
import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useTranslation} from "react-i18next"
import routes from "../../../routes/routes"
import {inject, observer} from "mobx-react"
import Box from "@mui/material/Box"
import ProfileButtonIcon from "./ProfileButtonIcon"
import profileMenu from "../../../layouts/profileMenu"

const ProfileBrowser = ({root: {logOut, isAuthenticated, username}}) => {
    const navigate = useNavigate()
    const [anchorElUser, setAnchorElUser] = useState(null)
    const handleOpenUserMenu = event => setAnchorElUser(event.currentTarget)
    const handleCloseUserMenu = path => {
        setAnchorElUser(null)
        navigate(path)
    }
    const {t} = useTranslation('авторизация')
    return <Box sx={{display: 'flex'}}>
        <Typography
            sx={{cursor: 'pointer'}}
            onClick={handleOpenUserMenu}
            variant="body1"
        >
            {username}
        </Typography>
        <ProfileButtonIcon
            handleOpen={handleOpenUserMenu}
            isAuthenticated={isAuthenticated}
            sx={{p: 0, ml: 1}}
        />
        <Menu
            sx={{mt: '45px'}}
            id="menu-appbar"
            anchorEl={anchorElUser || undefined}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
        >
            {isAuthenticated ?
                <MenuItem onClick={() => handleCloseUserMenu(routes.logout)}>
                    <Typography textAlign="center">{t('выход')}</Typography>
                </MenuItem>
                :
                profileMenu.map((item, idx) =>
                    <MenuItem key={idx} onClick={() => handleCloseUserMenu(item.route)}>
                        <Typography textAlign="center">{t(item.title)}</Typography>
                    </MenuItem>)
            }
        </Menu>
    </Box>
}
export default inject('root')(observer(ProfileBrowser))