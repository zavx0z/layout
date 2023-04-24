import {IconButton} from "@mui/material"
import {Login} from "@mui/icons-material"
import {matchPath, useLocation, useNavigate} from "react-router-dom"
import React from "react"

const ButtonLogin = ({to = '/auth/login'}) => {
    const navigate = useNavigate()
    const {pathname} = useLocation()
    const handleClick = () => !matchPath(to, pathname) && navigate(to)
    return <IconButton onClick={handleClick}>
        <Login color={"secondary"} alt={'login'}/>:
    </IconButton>
}
export default ButtonLogin