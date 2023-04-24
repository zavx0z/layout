import {matchPath, useLocation, useNavigate} from "react-router-dom"
import {IconButton} from "@mui/material"
import BotsWorkIcon from "../../../icons/BotsWorkIcon"
import React from "react"

export const ButtonLogo = ({to = '/', ...buttonProps}) => {
    const navigate = useNavigate()
    const {pathname} = useLocation()
    const handleClick = () => !matchPath(to, pathname) && navigate(to)
    return <IconButton onClick={handleClick}{...buttonProps}>
        <BotsWorkIcon/>
    </IconButton>
}