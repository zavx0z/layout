import {inject, observer} from "mobx-react"
import React, {useMemo} from "react"
import {isMobile} from "react-device-detect"
import {infoOrg} from "../../organism/info"
import LeftMenu from "./containers/LeftMenu"

export const Menu = inject('everything')(observer(({menuItems, everything}) => {
    const open = useMemo(() => Boolean(!isMobile), [])
    const superposition = useMemo(() => menuItems &&
        everything.neutron.sso.isAuthenticated ?
            menuItems :
            infoOrg,
        [menuItems, everything.neutron.sso.isAuthenticated])
    return <LeftMenu items={superposition} opened={open} visibleCloseButton={open}/>
}))