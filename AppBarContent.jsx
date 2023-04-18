import React from "react"
import Box from "@mui/material/Box"

const AppBarContent = ({left, center, right, children}) => <>
    <Box sx={{
        display: "flex",
        alignItems: 'center',
    }}>
        {left}
    </Box>
    <Box sx={{
        display: "flex",
        flexGrow: 1,
        alignItems: 'center',
    }}>
        {center}
        {children}
    </Box>
    <Box sx={{
        display: "flex",
        alignItems: 'center',
    }}>
        {right}
    </Box>
</>

export default AppBarContent
