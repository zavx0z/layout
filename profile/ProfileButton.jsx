import {isMobile} from "react-device-detect"
import ProfileMobile from "./ProfileMobile"
import ProfileBrowser from "./ProfileBrowser"
import {inject, observer} from "mobx-react"

const ProfileButton = ({root:{isAuthenticated}}) => isMobile ? <ProfileMobile isAuthenticated={isAuthenticated}/> : <ProfileBrowser/>
export default inject('root', 'pwa')(observer(ProfileButton))