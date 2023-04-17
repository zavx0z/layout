import Box from "@mui/material/Box"
import logo from "../../images/logo.png"
import {useNavigate} from "react-router-dom"
import routes from "../../routes/routes"

const Logo = () => {
    const navigate = useNavigate()
    return <Box
        onClick={() => navigate(routes.home)}
        component="img"
        alt="logo"
        sx={{
            maxHeight: 30,
            cursor: 'pointer'
        }}
        src={logo}
    />
}
export default Logo