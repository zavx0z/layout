import {matchPath, useLocation, useNavigate} from "react-router-dom"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import wordmark from "../../../images/wordmark.png"
import React from "react"

const ButtonWordMark = ({to = '/', ...buttonProps}) => {
    const navigate = useNavigate()
    const {pathname} = useLocation()
    const handleClick = () => !matchPath(to, pathname) && navigate(to)
    return <Button
        sx={{p: 0}}
        onClick={handleClick}
        {...buttonProps}
    >
        <Box sx={{p: 0, maxHeight: 12}}
             component={"img"}
             alt={"wordmark"}
             src={wordmark}
        />
    </Button>
}
export default ButtonWordMark