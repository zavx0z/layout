import {useNavigate} from "react-router-dom"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import wordmark from "../../../images/wordmark.png"
import React from "react"

const ButtonWordMark = ({to, ...buttonProps}) => {
    const navigate = useNavigate()
    return <Button
        sx={{p: 0}}
        onClick={() => navigate(to ? to : "/")}
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