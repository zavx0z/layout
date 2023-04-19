import Box from "@mui/material/Box"
import logo from "../../../images/logo.png"
import {useNavigate} from "react-router-dom"
import routes from "../../../routes/routes"

const Logo = (props) => {
    const navigate = useNavigate()
    return <Box
        onClick={() => navigate(routes.home)}
        component="img"
        alt="logo"
        draggable="false"
        sx={theme => ({
            pl: theme.spacing(1),
            maxHeight: 24,
            cursor: 'pointer',
            WebkitUserSelect: 'none',
            KhtmlUserSelect: 'none',
            MozUserSelect: 'none',
            OUserSelect: 'none',
            userSelect: 'none',
        })}
        src={logo}
        {...props}
    />
}
export default Logo