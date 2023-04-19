import {IconButton} from "@mui/material"
import {AccountBox, Login} from "@mui/icons-material"
import {useNavigate} from "react-router-dom"
import {inject, observer} from "mobx-react"

const Icon = ({isAuthenticated}) => isAuthenticated ?
    <AccountBox
        fontSize={'medium'}
        alt="Profile"
        color={"secondary"}
        // src={logo}
    /> :
    <Login color={"secondary"}/>

const ProfileButton = ({root: {isAuthenticated}, authRoute, profileRoute}) => {
    const navigate = useNavigate()
    const handleClick = () => navigate(isAuthenticated ? profileRoute : authRoute)
    return <IconButton onClick={handleClick}>
        <Icon isAuthenticated={isAuthenticated}/>
    </IconButton>
}
export default inject('root')(observer(ProfileButton))