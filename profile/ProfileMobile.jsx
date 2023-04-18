import {useNavigate} from "react-router-dom"
import ProfileButtonIcon from "./ProfileButtonIcon"
import routes from "../../../routes/routes"

export const MobileProfile = ({isAuthenticated}) => {
    const navigate = useNavigate()
    return <ProfileButtonIcon handleOpen={() => navigate(routes.profile)} isAuthenticated={isAuthenticated}/>
}

export default MobileProfile