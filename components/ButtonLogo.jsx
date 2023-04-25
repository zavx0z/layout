import {matchPath, useLocation, useNavigate} from "react-router-dom"
import {IconButton} from "@mui/material"
import React from "react"
import BotsWorkIcon from "../../../resource/icons/BotsWorkIcon"

export const ButtonLogo = ({to = '/', ...buttonProps}) => {
    const navigate = useNavigate()
    const {pathname} = useLocation()
    const handleClick = () => Boolean(to) ? !matchPath(to, pathname) && navigate(to) : navigate('/')
    return <IconButton onClick={handleClick}{...buttonProps}>
        <BotsWorkIcon/>
    </IconButton>
}