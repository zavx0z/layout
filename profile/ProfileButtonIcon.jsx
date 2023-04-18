import {IconButton} from "@mui/material"
import {AccountBox, Login} from "@mui/icons-material"

const Icon = ({isAuthenticated}) => isAuthenticated ?
    <AccountBox
        fontSize={'medium'}
        alt="Profile"
        color={"secondary"}
        // src={logo}
    /> :
    <Login color={"secondary"}/>

const ProfileButtonIcon = ({handleOpen, isAuthenticated, ...other}) => {
    return <IconButton
        onClick={handleOpen}
        {...other}
    >
        <Icon isAuthenticated={isAuthenticated}/>
    </IconButton>
}
export default ProfileButtonIcon