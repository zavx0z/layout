import {useLocation, useNavigate} from "react-router-dom"
import {IconButton} from "@mui/material"
import BotsWorkIcon from "../../../icons/BotsWorkIcon"
import React from "react"

export const ButtonLogo = ({to, ...buttonProps}) => {
    const navigate = useNavigate()
    const location = useLocation()
    return <IconButton
        onClick={() => navigate(to ? to : "/")}
        {...buttonProps}
    >
        <BotsWorkIcon/>
    </IconButton>
}