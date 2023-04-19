import {IconButton} from "@mui/material"
import {ArrowBackIosNew} from "@mui/icons-material"
import {useNavigate} from "react-router-dom"

const ButtonBackHistory = () => {
    const navigate = useNavigate()
    return <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIosNew color={'info'}/>
    </IconButton>
}
export default ButtonBackHistory