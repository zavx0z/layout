import Toolbar from "@mui/material/Toolbar"
import {AppBar as MuiAppBar, Slide} from "@mui/material"
import React from "react"

const AppBar = ({children}) =>
    <Slide in={true} direction="down">
        <MuiAppBar
            position="static"
            // color={'secondary'}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 444,
                overflow: 'hidden'
        }}>
            <Toolbar
                sx={theme => ({
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    '&.MuiToolbar-root': {
                        p: 0
                    }
                }
            )}>
                {children}
            </Toolbar>
        </MuiAppBar>
    </Slide>

export default AppBar