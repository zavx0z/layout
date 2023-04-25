import {IconButton} from "@mui/material"
import {AccountBox} from "@mui/icons-material"
import {matchPath, useLocation, useNavigate} from "react-router-dom"
import React from "react"

const ButtonProfile = ({to = '/profile'}) => {
    const navigate = useNavigate()
    const {pathname} = useLocation()
    const handleClick = () => Boolean(to) ? !matchPath(to, pathname) && navigate(to) : navigate('/')
    return <IconButton onClick={handleClick}>
        <AccountBox alt="Profile" color={"secondary"}/> :
    </IconButton>
}
export default ButtonProfile
