import Toolbar from "@mui/material/Toolbar"
import {AppBar as MuiAppBar, Slide} from "@mui/material"
import React from "react"

const AppBar = ({children}) =>
    <Slide in={true} direction="down">
        <MuiAppBar position="static" sx={{zIndex: (theme) => theme.zIndex.drawer + 1, overflow: 'hidden'}}>
            <Toolbar sx={theme => ({
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    '&.MuiToolbar-root': {
                        pl: theme.spacing(2),
                        pr: theme.spacing(2)
                    }
                }
            )}>
                {children}
            </Toolbar>
        </MuiAppBar>
    </Slide>

export default AppBar